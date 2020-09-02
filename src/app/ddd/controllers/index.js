// const sha256 = require('crypto-js/sha256')
// const tools = require('../../../common/tools')
// const dao = require('../dao/index')
// const { result } = require('./result')

// // 用户名是否注册检查
// async function checkUserName ({ ctx, url }) {
//     let user = await dao.getUserByUserName(ctx.query.userName)
//     ctx.body = result({ data: !!user })
// }
// // 昵称是否已被使用检查
// async function checkNickName ({ ctx, url }) {
//     let user = await dao.getUserByNickName(ctx.query.nickName)
//     ctx.body = result({ data: !!user })
// }
// // 邮箱是否已被注册检查
// async function checkEmail ({ ctx, url }) {
//     let user = await dao.getUserByEmail(ctx.query.email)
//     ctx.body = result({ data: !!user })
// }
// // 用户注册
// async function createUser ({ ctx, url }) {
//     const { userName, nickName, password, email } = ctx.request.body
//     // 用户名校验
//     let existUser = await dao.getUserByUserName(userName)
//     if (!existUser) {
//         ctx.body = result({ data: false, status: 10001, message: '用户名已存在' })
//         return
//     }
//     // 昵称校验
//     existUser = await dao.getUserByNickName(nickName)
//     if (!existUser) {
//         ctx.body = result({ data: false, status: 10002, message: '昵称已存在' })
//         return
//     }
//     // 邮箱检验
//     existUser = await dao.getUserByEmail(email)
//     if (!existUser) {
//         ctx.body = result({ data: false, status: 10002, message: '邮箱已存在' })
//         return
//     }
//     // 用户注册数据
//     let user = {
//         userName, nickName, email
//     }
//     user.salt = tools.getUUID()
//     // 密码sha256加密
//     let passwordSign = sha256(user.salt + password).toString()
//     user.password = passwordSign
//     // 注册时间
//     user.createTime = new Date()
//     // 排名

//     let res = await dao.createUser(user)
//     ctx.body = result({ data: res })
// }

// // console.log(sha256(tools.getUUID() + 'message').toString())

// // 获取项目列表
// // async function getProjectList ({ ctx, url }) {
// //     ctx.body = result(await dao.getProjectList())
// // }

// // // 获取项目分组
// // function getGroupName ({ ctx, url }) {
// //     ctx.body = result({ data: groupName.data })
// // }
// // // 获取服务列表
// // async function getServerList ({ ctx, url }) {
// //     ctx.body = result(await dao.getServiceList())
// // }

// // // 创建项目
// // async function createProject ({ ctx, url }) {
// //     console.log(ctx.query)
// //     ctx.body = result(await dao.creatProject(ctx.query))
// // }

// // async function getProjectDetail ({ ctx, url }) {
// //     ctx.body = result(await dao.getProjectDetail(ctx.query))
// // }

// // // 获取项目的可部署列表
// // async function getDeployList ({ ctx, url }) {
// //     ctx.body = result(await dao.getDeployList(ctx.request.query.projectId))
// // }

// // // 修改占用状态
// // async function envUse ({ ctx, url }) {
// //     const { deployId, use, userName, userId } = ctx.request.body
// //     ctx.body = result(await dao.envUse(deployId, use, userName, userId))
// // }

// // // 部署操作
// // // TODO
// // async function publish ({ ctx, url }) {
// //     // 获取部署信息

// //     // 部署

// //     // 部署日志记录
// //     ctx.body = result({})
// // }

// // // 日志列表
// // async function logList ({ ctx, url }) {
// //     const projectId = ctx.request.query.projectId
// //     const pageSize = ctx.request.query.pageSize
// //     const pageNum = ctx.request.query.pageNum
// //     ctx.body = result(await dao.getLogList({ projectId, pageSize, pageNum }))
// // }

// // // 日志详情
// // async function logInfo ({ ctx, url }) {
// //     const logId = ctx.request.query.logId
// //     ctx.body = result(await dao.getLogInfo(logId))
// // }

// // // 删除历史版本
// // // TODO
// // async function delHistoryVersion ({ ctx, url }) {
// //     ctx.body = result({})
// // }

// module.exports = {
//     checkUserName,
//     checkNickName,
//     checkEmail,
//     createUser
//     // getProjectList,
//     // getDeployList,
//     // envUse,
//     // publish,
//     // logList,
//     // logInfo,
//     // delHistoryVersion,
//     // getGroupName,
//     // getServerList,
//     // createProject,
//     // getProjectDetail
// }
