// 须放到业务代码之前初始化，避免业务代码中使用到logger未被默认初始化
const { initLog, loggerMid, getLogger, toggleLog } = require('./log')

// 参数中logLevel 可以不传; 加载该文件时直接初始化
initLog({
    logLevel: 'INFO', // 缺省日志级别
    appName: 'node-ddd', // 业务名字
    funLogHead (ctx) {
        return [ctx.feTraceid || '']
    }
})

// 需init之后再get
const logger = getLogger()

const stringify = function (ctx, obj) {
    try {
        const str = JSON.stringify(obj)
        return str
    } catch (error) {
        logger.error(ctx, '【stringify】', error)
    }
    return obj
}

module.exports = {
    logger,
    toggleLog,
    loggerMiddlewares (app) {
        // 日志中间件，后面可以用ctx.logger.xxx来打日志
        app.use(loggerMid)
        // trace 跟踪中间件
        app.use(async function (ctx, next) {
            // 请求开始
            const start =  Date.now()
            const cookied = ctx.cookies.get('d_id') // 客户端用户指纹
            // 上下文挂载 traceId: 用户指纹 + 开始时间 + 随机数（防止同一时间的用户的两个请求
            ctx.feTraceid = `${cookied || 'anonymous'}-${start}-${Math.round(Math.random() * 10000)}`
            logger.info(ctx, `【HTTP入口-start】 ${ctx.method} ${ctx.href},UA:${ctx.request.header['user-agent']}},ip: ${ctx.ip}, refer:${ctx.request.get('referer')}`)
            // 继续向下匹配路由
            await next()
            // 接口结束前
            const ms = Date.now() - start
            const status = ctx.response.status
            const redirect = status === '302' ? ctx.response.get('location') : ''
            logger.info(ctx, `【HTTP入口-end】response:${status} ${ctx.href} ${redirect} cost ${ms}ms`)
        })
    },
    // http.js中使用
    httpTraceLog () {
        return {
            errorLog (config = {}, response = {}) {
                let { methods = '', url = '', params = '', data = '', ctx = {} } = config
                logger.error(ctx, `【拦截器】request Fail: ${methods} ${url} params:${stringify(ctx, params)} data:${stringify(ctx, data)}`)
            },
            infoLog (config = {}, response = {}) {
                let { methods = '', url = '', params = '', data = '', ctx = {}, responseType } = config
                // 日志打印
                try {
                    // 返回二维码场景
                    const isStream = responseType && responseType === 'stream'
                    if (isStream) {
                        logger.info(ctx, `【拦截器】stream: ${methods} rd: ${url} params:${stringify(ctx, params)}, req data:${stringify(ctx, data)}`)
                        return
                    }
                    // 常规场景
                    const isJsonResponse = !((responseType && responseType !== 'json'))
                    let status = typeof response.data.status !== 'undefined' ? response.data.status : response.data.code
                    if (isJsonResponse && parseInt(status) !== 0) {
                        // 与rd约定，接口成功返回code===0，其余为失败
                        logger.warn(ctx, `【拦截器】http response code !==0 :${methods} rd: ${url} params:${stringify(ctx, params)} data:${stringify(ctx, data)} response:${stringify(ctx, response.data)}`)
                    } else {
                        // 成功日志记录，限制数据大小
                        const MaxLen = 1024
                        let respData = stringify(ctx, response.data)
                        if (respData.length > MaxLen) {
                            respData = respData.substr(0, MaxLen) + '...'
                        }
                        logger.debug(ctx, `【拦截器:debug】req header:${stringify(ctx, config.headers)},response header:${stringify(ctx, response.headers)}`)
                        logger.info(ctx, `【拦截器】${methods} rd: ${url} params:${stringify(ctx, params)}, req data:${stringify(ctx, data)}, response data:${respData}`)
                        logger.debug(ctx, 'responseType', responseType)
                    }
                } catch (error) {
                    logger.error(ctx, '【拦截器】', error)
                }
            }
        }
    }
}
