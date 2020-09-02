const path        = require('path')
const Koa         = require('koa')
const views       = require('koa-views')
const parser      = require('koa-bodyparser')
const koaStatic   = require('koa-static')
const koaMount    = require('koa-mount')
const cors        = require('koa2-cors')
const app         = new Koa()
const { port, routerRoot } = require('./config/base')
const middlewares = require('./middlewares/index')
const register    = require('./common/register')
const tools       = require('./common/tools')
const { logger, loggerMiddlewares, toggleLog } = require('./common/log/traceLog')
// 须放到业务代码之前初始化，避免业务代码中使用到logger未被默认初始化
loggerMiddlewares(app)

app.use(cors({
    origin: function (ctx) {
        let origin = ctx.get('Origin')
        if (origin && (origin.includes('digdigdig.vip'))) return origin
        else return false
    },
    maxAge: 5,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'd-token', 'd-id'],
    credentials: true
}))

// 公共数据
app.use(async (ctx, next) => {
    // ejs模版中使用该变量动态加载对应模版
    ctx.state = { EJS_ENV: tools.getENV() }
    // 继续向下匹配路由
    await next()
})
// 入口页-注意：必须放在路由注册前面
app.use(views(path.join(__dirname, './app'), {
    extension: 'ejs'
}))
// post参数解析
app.use(parser())
// 自定义拦截器
middlewares(app)
// 模块注册
app.use(register.launch())
// 静态资源支持
app.use(koaMount(`${routerRoot}/static`, koaStatic(path.join(__dirname, '../static'))))
// 通过此种方式自动切换日志级别到trace【pm2 sendSignal SIGUSR2 业务的名称】，两次执行还原为info
process.on('SIGUSR2', (msg) => {
    logger.warn(`~~~~~ SIGUSR2~~~~~~,cur level:${logger.level.levelStr}, toggle log level now.`)
    toggleLog()
})
app.listen(port)

console.log('\n App running at:')
console.log(' - Local:   http://localhost:' + port)
