// const dao = require('../../app/ddd/dao/loginDao')
const crypto = require('./crypto')

const session = require('./session')

function setResponse (ctx) {
    // let domain = 'digdigdig.vip'
    // ctx.cookies.set('d_id', '', { domain: domain })
    // ctx.cookies.set('d_token', '', { domain: domain })
    // 用户未登录，设置401未授权状态码，直接返回
    // ctx.status = 401
    ctx.body = { status: 401, message: '未授权，请登录', data: false }
}

/**
 * 是否登录验证相关
 */
const loginCheck = {
    /**
     * 登录拦截逻辑
     * @param res
     * @returns {boolean}
     */
    async loginIntercept (ctx, intercept = true) {
        // const cookie  = ctx.cookies
        // const dId     = cookie.get('d_id')
        // const dToken  = cookie.get('d_token')
        const headers = ctx.headers
        const dId     = headers['d-id']
        const dToken  = headers['d-token']
        // 只要其中一个无值则表示未登录状态
        if (!dId || !dToken) {
            if (!intercept) { return true }
            setResponse(ctx)
            return false
        }
        const decodeToken = crypto.decrypt(dToken)
        // 判断id是否与解密后的一致
        // eslint-disable-next-line no-unused-vars
        const [userId, userName, time] = decodeToken.split('_')
        if (userId !== dId) {
            if (!intercept) { return true }
            setResponse(ctx)
            return false
        }

        // 登录成功,设置用户id到context上
        session.setUid(ctx, userId)
        return true

        // 暂不从数据库校验，提升性能
        // // 判断是否存在该用户
        // let user = await dao.getUserByUserId(uid)
        // if (user) {
        //     // 登录成功,设置用户id到context上
        //     session.setUid(ctx, user.userId)
        //     return true
        // } else {
        //     // intercept为false是表示即使登录失败也会透传到业务ctrl中；放到这里即:即使校验未登录也返回已登录状态
        //     if (!intercept) { return true }
        //     setResponse(ctx)
        //     return false
        // }
    }
}

module.exports = loginCheck
