const crypto = require('../../../common/login/crypto')
const tools = require('../../../common/tools')
const dao = require('../dao/loginDao')
const { result } = require('./result')

// 用户名是否注册检查
async function checkUserName ({ ctx, url }) {
    let user = await dao.getUserByUserName(ctx.query.userName)
    ctx.body = result({ data: !!user })
}
// 昵称是否已被使用检查
async function checkNickName ({ ctx, url }) {
    let user = await dao.getUserByNickName(ctx.query.nickName)
    ctx.body = result({ data: !!user })
}
// 邮箱是否已被注册检查
async function checkEmail ({ ctx, url }) {
    let user = await dao.getUserByEmail(ctx.query.email)
    ctx.body = result({ data: !!user })
}
// 用户注册
async function createUser ({ ctx, url }) {
    const { userName, nickName, password, email } = ctx.request.body
    // 用户名校验
    let existUser = await dao.getUserByUserName(userName)
    if (existUser) {
        ctx.body = result({ data: false, status: 10001, message: '用户名已存在' })
        return
    }
    // 昵称校验
    existUser = await dao.getUserByNickName(nickName)
    if (existUser) {
        ctx.body = result({ data: false, status: 10002, message: '昵称已存在' })
        return
    }
    // 邮箱检验
    existUser = await dao.getUserByEmail(email)
    if (existUser) {
        ctx.body = result({ data: false, status: 10002, message: '邮箱已存在' })
        return
    }
    // 用户注册数据
    let user = {
        userName, nickName, email
    }
    user.userId = tools.getUUID()
    user.salt = tools.getUUID()
    // 密码sha256加密
    let passwordSign = crypto.generatePassword(user.salt, password)
    user.password = passwordSign
    // 注册时间
    user.createTime = new Date()
    // 排名
    let count = await dao.getUserCount()
    user.registerRank = count + 1
    // console.log(user)
    let res = await dao.createUser(user)
    ctx.body = result({ data: { registerRank: res.registerRank } })
}

// 用户登录
async function login ({ ctx, url }) {
    const { userName, password } = ctx.request.body
    let user = await dao.getUserByUserName(userName)
    // console.log(user)
    if (user) {
        let passwordSign = crypto.generatePassword(user.salt, password)
        if (passwordSign === user.password) {
            // let domain = 'digdigdig.vip'
            let token = crypto.encrypt(`${user.userId}_${user.userName}_${(new Date()).getTime()}`)
            // ctx.cookies.set('d_token', token, { domain: domain })
            // ctx.cookies.set('d_id', user.userId, { domain: domain, httpOnly: false })
            // 无法跨域设置cookie，修改为前端设置
            ctx.body = result({ data: { token: token, id: user.userId } })
            // 更新最后登录时间
            user.lastLoginTime = new Date()
            user.save()
            return
        }
    }
    ctx.body = result({ status: 401, message: '用户名或密码错误' })
}

module.exports = {
    checkUserName,
    checkNickName,
    checkEmail,
    createUser,
    login
}
