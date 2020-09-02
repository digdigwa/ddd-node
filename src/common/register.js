const Router = require('koa-router')
const router = Router()
const proxy = require('./proxy')
const tools = require('./tools')
const { getLogger } = require('./log/log')
const logger = getLogger()
const { routerRoot } = require('../config/base')
const loginCheck = require('./login/loginCheck')
const session = require('./login/session')

/**
 * 模块注册
 */
class Register {
    // eslint-disable-next-line space-before-function-paren
    constructor() {
        this.routers = {}   // 存储所有的路由与后端接口的键值对
    }

    /**
   * 启动路由注册
   * @returns {*}
   */
    launch () {
        let apps = this.getApps()
        apps.forEach(appName => {
            let config = require(`../app/${appName}/index`)
            // 透传部分
            Object.entries(config.proxy).map(([path, target]) => {
                let { url, login, intercept, extParams } = this.getProxyParams(target)
                this.addRouter({
                    routerPath: `${routerRoot}${path}`,
                    target: url,
                    callback: async ctx => {
                        // 支持extParams为function类型,传入ctx方便从request中获取数据
                        let reqParams = Object.assign({}, typeof (extParams) === 'function' ? extParams(ctx) : extParams)
                        // 登录校验
                        if (login) {
                            if (await loginCheck.loginIntercept(ctx, intercept)) {
                                // 已登录，获取用户uid; intercept为false时uid可能为空
                                reqParams.cpId = session.getUid(ctx)
                            } else {
                                // 未登录状态；且需要拦截，不再接入业务逻辑部分
                                if (intercept) { return }
                            }
                        }
                        // 接口透传
                        // await proxy.launch({ url, extParams }, ctx)
                        try {
                            await proxy.launch({ url, reqParams }, ctx)
                            // 接口透传
                        } catch (e) {
                            logger.error(ctx, '【proxy error】', path, e)
                            // 如果为接口，则范围错误对象，避免返回字符串前端无法识别
                            if (path.startsWith('/i/')) {
                                ctx.body = {
                                    status: -501,
                                    data: {},
                                    message: '系统错误'
                                }
                            }
                        }
                    }
                })
            })
            // 自定义部分
            Object.entries(config.custom).map(([path, config]) => {
                let { url, ctrl, login, intercept } = this.getProxyParams(config)
                this.addRouter({
                    routerPath: `${routerRoot}${path}`,
                    target: url,
                    callback: async ctx => {
                        let uid = ''
                        // 登录校验
                        if (login) {
                            if (await loginCheck.loginIntercept(ctx, intercept)) {
                                // 已登录，获取用户uid; intercept为false时uid可能为空
                                uid = session.getUid(ctx)
                            } else {
                                // 未登录状态；且需要拦截，不再进入业务逻辑部分
                                if (intercept) { return }
                            }
                        }
                        await ctrl({ ctx, url, uid })
                    }
                })
            })
        })

        // 测试环境新增路由查询接口，返回中间层接口对应的后端接口地址
        if (!tools.isProdENV()) {
            this.addRouter({
                routerPath: `${routerRoot}/sys/getTargetUrl`,
                callback: async ctx => {
                    let url = ctx.query.url
                    let result = this.routers[url] || '无查询结果'
                    ctx.body = result
                }
            })
        }

        return router.routes()
    }

    /**
   * 透传参数获取
   * @param config
   * @returns {{url: *, login: boolean, intercept: boolean, extParams}}
   */
    getProxyParams (config) {
    // 透传兼容字符串配置
        let url = config
        // 默认不做登录拦截
        let login = false
        // 默认拦截到未登录返回401，不再进入具体的业务逻辑
        let intercept = true
        // 默认参数
        let extParams = {}
        // 自定义部分才会使用
        let ctrl = null
        if (typeof (config) === 'object') {
            url = config.url
            login = config.login || false
            intercept = config.intercept === undefined ? true : config.intercept
            extParams = config.extParams || {}
            ctrl = config.ctrl
        }
        return { url, login, intercept, extParams, ctrl }
    }

    /**
   * 路由注册
   * @param routerPath    // 路由地址
   * @param callback      // 回调函数
   */
    addRouter ({ routerPath, target, callback }) {
        if (this.check(routerPath)) {
            // 错误日志打印
            logger.error(`路由【${routerPath}】已存在，取消注册`)
            return
        }
        // 路由注册
        router.all(routerPath, async (ctx, next) => {
            await callback(ctx)
            // 匹配上一个就不再继续向下匹配
            // await next()
        })
        // 添加到已注册路由列表中
        this.routers[routerPath] = target
    }

    /**
   * 检查路由是否已被注册
   * @param routerPath
   * @returns {boolean}
   */
    check (routerPath) {
        return Object.keys(this.routers).some(key => {
            // return key.startsWith(routerPath)
            return routerPath === key
        })
    }

    /**
   * 动态获取应用名称
   * 取src/app目录下的一级目录
   * @returns {Array}
   */
    getApps () {
        const fs = require('fs')
        const path = require('path')

        let apps = []
        const dir = path.resolve(__dirname, '../app')
        fs.readdirSync(dir).forEach(function (file) {
            let isDirectory = fs.lstatSync(dir + '/' + file).isDirectory()
            let haveIndexFile = fs.existsSync(dir + '/' + file + '/index.js')
            if (isDirectory && haveIndexFile) {
                apps.push(file)
            }
        })
        return apps
    }
}

module.exports = new Register()
