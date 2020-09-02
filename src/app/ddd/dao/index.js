// // const { QueryTypes } = require('sequelize')
// // const { sequelize } = require('../../../common/db')
// // const { Project, Config, Log, Server } = require('../../../model')
// const { User } = require('../model')

// async function getUserByUserName (userName) {
//     const user = await User.findOne({ where: { userName } })
//     return user
// }
// async function getUserByNickName (nickName) {
//     const user = await User.findOne({ where: { nickName } })
//     return user
// }
// async function getUserByEmail (email) {
//     const user = await User.findOne({ where: { email } })
//     return user
// }
// // 注册
// async function userCreate (user) {
//     const res = await User.create(user)
//     return res
// }

// // console.log(tools.getUUID())
// // // console.log('9158813a-3a88-4da9-b384-f337408e0125'.replace(/-/g, ''))
// // userCreate({
// //     userId: tools.getUUID(),
// //     userName: '21',
// //     nickName: '21',
// //     password: '21',
// //     email: '21',
// //     createTime: new Date(),
// //     salt: tools.getUUID(),
// //     registerRank: 1
// // })

// // /**
// //  * 获取所有项目
// //  */
// // async function getProjectList () {
// //     const projectList = await Project.findAll()
// //     return { data: projectList }
// // }

// // /**
// //  * 获取所有服务器
// //  */
// // async function getServiceList (params) {
// //     const ServerList = await Server.findAll()
// //     return { data: ServerList }
// // }

// // /**
// //  * 获取详情
// //  * @param {} params
// //  */
// // async function getProjectDetail (params) {
// //     const [ projectInfo, projectConfig ] = await Promise.all([
// //         Project.findOne({ where: { projectId: params.projectId } }), // 查看项目配置
// //         Config.findAll({ where: { projectId: params.projectId }, include: [Server] }) // 查看服务配置
// //     ])
// //     const serverList = projectConfig.map(item => (item.dataValues))
// //     const data = Object.assign(projectInfo.dataValues, { serverList })
// //     return {
// //         data
// //     }
// // }

// // /**
// //  * 获取项目都可以部署到哪些机器上
// //  * @param {项目ID} projectId
// //  */
// // async function getDeployList (projectId) {
// //     // const deployList = await Config.findAll({ where: { projectId } })
// //     const sql = 'SELECT conf.deploy_id as deployId,conf.`using`,conf.use_time as useTime,conf.user_name as userName, ser.server_name as serverName,ser.ip FROM fe_edu_d_config as conf LEFT JOIN fe_edu_d_server as ser ON conf.server_id = ser.server_id WHERE conf.project_id=?;'
// //     const deployList = await sequelize.query(sql, { replacements: [projectId], type: QueryTypes.SELECT })
// //     return { data: deployList || [] }
// // }

// // /**
// //  * 环境占用
// //  * @param {部署配置ID} deployId
// //  * @param {占用状态} use
// //  */
// // async function envUse (deployId, use, userName, userId) {
// //     const config = await Config.findByPk(deployId)
// //     if (!config) {
// //         return { status: 404, message: '无部署配置' }
// //     }
// //     config.using = use
// //     config.useTime = use ? (new Date()).getTime() : null
// //     config.userName = use ? userName : ''
// //     config.userId = use ? userId : 0
// //     config.save()
// //     return { status: 0, message: '保存成功', data: true }
// // }

// // function creatProject (params) {
// //     const projectParams = {
// //         'projectName': params.projectName,
// //         'groupName': params.groupName,
// //         'git': params.git
// //     }
// //     return Project.findAll({ where: { projectName: projectParams.projectName } }).then((data) => {
// //         if (data && data.length) {
// //             const error = new Error('当前项目已注册')
// //             throw error
// //         }
// //         return Project.create(projectParams)
// //     }).then((data) => {
// //         if (!data) {
// //             const error = new Error('项目创建失败')
// //             throw error
// //         }
// //         const configParams = (params.ServerList || []).map((item) => ({
// //             projectId: data.dataValues.projectId,
// //             serverId: item.serverId,
// //             deployCmd: item.deployCmd
// //         }))
// //         Config.bulkCreate(configParams)
// //         console.log(data.dataValues.projectId)
// //     }).catch(error => {
// //         return { status: 404, message: error.message }
// //     })
// // }

// // /**
// //  * 获取日志列表
// //  * @param {项目ID} projectId
// //  * @param {每页数据条数} pageSize
// //  * @param {当前第几页} pageNum
// //  */
// async function getLogList ({ projectId, pageSize, pageNum }) {
//     const { count, rows } = await Log.findAndCountAll({
//         where: { projectId: projectId },
//         offset: Number(pageSize),
//         limit: Number(pageNum)
//     })
//     return { status: 0, message: '成功', data: { count, rows } }
// }

// // /**
// //  * 获取日志详情
// //  * @param {日志ID} logId
// //  */
// // async function getLogInfo (logId) {
// //     const log = await Log.findByPk(logId)
// //     return { data: log }
// // }

// module.exports = {
//     getUserByUserName,
//     getUserByNickName,
//     getUserByEmail,
//     userCreate
//     // getProjectList,
//     // getDeployList,
//     // envUse,
//     // getLogList,
//     // getLogInfo,
//     // getServiceList,
//     // creatProject,
//     // getProjectDetail
// }
