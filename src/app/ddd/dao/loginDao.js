const { User } = require('../model')

// 通过用户ID获取用户
async function getUserByUserId (userId) {
    const user = await User.findOne({ where: { userId } })
    return user
}
// 通过用户名获取用户
async function getUserByUserName (userName) {
    const user = await User.findOne({ where: { userName } })
    return user
}
// 通过昵称获取用户
async function getUserByNickName (nickName) {
    const user = await User.findOne({ where: { nickName } })
    return user
}
// 通过邮箱获取用户
async function getUserByEmail (email) {
    const user = await User.findOne({ where: { email } })
    return user
}
// 注册
async function createUser (user) {
    const res = await User.create(user)
    return res
}
// 获取现有注册数
async function getUserCount () {
    const count = await User.count()
    return count
}

module.exports = {
    getUserByUserId,
    getUserByUserName,
    getUserByNickName,
    getUserByEmail,
    getUserCount,
    createUser
}
