const { getLogger } = require('../../common/log/log')
const logger = getLogger()

const index = () => async (ctx, next) => {
    try {
        await next()
        if (ctx.status === 404) {
            // 触发渲染404页面 (node 无此路由时)
            await ctx.render('../middlewares/errorHandler/404')
        }
    } catch (e) {
    // 监听其他错误
        logger.error(ctx, e)
        // 确保程序抛错的情况下也有路由日志
        logger.info(ctx, `${ctx.request.method} ${ctx.request.url} ${ctx.response.status} ${ctx.request.origin} ${ctx.request.ip} ${ctx.request.header['user-agent']}`)
    }
}

module.exports = index
