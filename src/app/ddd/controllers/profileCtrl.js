const crypto = require('../../../common/login/crypto')
const dao = require('../dao/loginDao')
const { result } = require('./result')

// 获取用户信息
async function getUserInfo ({ ctx, uid }) {
    let user = await dao.getUserByUserId(uid)
    if (user) {
        ctx.body = result({ data: {
            userId: user.userId,
            userName: user.userName,
            nickName: user.nickName,
            email: user.email
        } })
    } else {
        ctx.body = result({ status: 404, message: '无记录' })
    }
}

// 用户信息修改
async function modifyUserInfo ({ ctx, uid }) {
    let { avatar, nickName, password } = ctx.request.body
    let user = await dao.getUserByUserId(uid)
    // 头像修改
    if (avatar && avatar !== user.avatar) {
        user.avatar = avatar
    }
    // 昵称修改
    if (nickName !== user.nickName) {
        user.nickName = nickName
    }
    // 密码修改
    if (password) {
        let passwordSign = crypto.generatePassword(user.salt, password)
        if (passwordSign !== user.password) {
            user.password = passwordSign
        }
    }
    try {
        await user.save()
        ctx.body = result({ data: true })
    } catch (error) {
        console.error(error)
        ctx.body = result({ status: 500, message: '系统异常，稍后再试' })
    }
}

module.exports = {
    getUserInfo,
    modifyUserInfo
}
