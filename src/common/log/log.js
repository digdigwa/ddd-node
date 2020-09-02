const log4js = require('log4js')
let loggerApp = null
let defaultLogLevel = 'TRACE'
let getLogHead = (ctx) => {
    return []
}
let getLogTail = (ctx) => {
    return []
}
const arrLogFun = [ 'trace', 'debug', 'info', 'warn', 'error', 'fatal' ]

// console.log(arrLevels)
module.exports = {
    initLog: function ({
        logLevel = 'INFO',
        appName = 'application',
        funLogHead = getLogHead,
        funLogTail = getLogTail
    }) {
        defaultLogLevel = logLevel
        getLogHead = funLogHead
        getLogTail = funLogTail

        const conf = {
            // 日志输出目标
            appenders: {
                // 输出到终端，在pm2环境下日志会被pm2收集到自身日志中
                default: {
                    type: 'stdout',
                    layout: {
                        type: 'pattern',
                        // pattern: '[%p] %c - %m'
                        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} [%p] %c - %m'
                    }
                }
            },
            // 日志类型，打印出的日志会有标识
            categories: {
                // 默认类型
                default: {
                    appenders: ['default'],
                    level: defaultLogLevel
                },
                // 业务应用
                [appName]: {
                    // enableCallStack: true,
                    appenders: ['default'],
                    level: defaultLogLevel
                }
            },
            pm2: true, // 支持pm2
            disableClustering: true // 支持pm2
        }
        // 配置log4js
        log4js.configure(conf)

        // 日志单例
        loggerApp = log4js.getLogger(appName)
        arrLogFun.forEach((funName) => {
            const oldFun = loggerApp[ funName ]
            // 对日志单例上的每一个日志函数进行代理，打印日志时注入自定义的logHead和logTail,打印日志方法执行时才进入代理后的逻辑
            // ctx属性是打印日志时传进来的，分两种情况
            // 情况1：ctx.logger.xxx是通过logMid初始化时，通过bind方法给每一个方法的第一个参数之前插入了ctx属性
            // 情况2：直接通过const logger = getLogger(); 通过log.xxx(ctx,logcontent) 调用时，此时没有ctx上下文，需要调用时把ctx作为第一个参数传进来，通过isCtx方法来判断第一个参数是否是ctx，如果是，则把第一个参数剔除并获取logHead和logTail，注入到日志中；如果不传，第一个参数不是ctx，则不会打印logHead和logTail。
            loggerApp[funName] = new Proxy(oldFun, {
                apply: function (target, thisArg, argumentList) {
                    let logCtx = {}
                    if ((argumentList[ 0 ] || {}).isCtx) {
                        logCtx = argumentList.shift()
                    }

                    const logHead = getLogHead(logCtx)
                    const logTail = getLogTail(logCtx)
                    return target.apply(thisArg, [...logHead, ...argumentList, ...logTail])
                }
            })
        })

        return true
    },
    loggerMid: async (ctx, next) => {
        ctx.isCtx = true
        ctx.logger = {}
        // ctx.logger不再直接引用外面的单例，而是是单独的一个对象，ctx.logger.xxx 方法是直接调用日志单例上的方法，只是通过bind 把ctx属性附加到方法上
        arrLogFun.forEach((funName) => {
            ctx.logger[funName] = loggerApp[funName].bind(loggerApp, ctx)
        })

        ctx.logger.debug('logger midware init ...')
        await next()
    },
    getLogger: () => {
        return !loggerApp ? log4js.getLogger('default') : loggerApp
    },
    toggleLog: () => {
        loggerApp.level = loggerApp.level.levelStr !== 'TRACE' ? 'TRACE' : defaultLogLevel
    }
}
