// const cf    = require('../../config/domain')
const loginCtrl  = require('./controllers/loginCtrl')
const profileCtrl  = require('./controllers/profileCtrl')
const teamCtrl  = require('./controllers/teamCtrl')
const teamMemberCtrl  = require('./controllers/teamMemberCtrl')
const tagCtrl  = require('./controllers/tagCtrl')
const docCtrl  = require('./controllers/docCtrl')
const weeklyCtrl  = require('./controllers/weeklyCtrl')

/**
 * 整个模块的路由配置
 * 自动挂载到app中
 */
module.exports = {
    // 透传接口配置
    proxy: {},
    // 自定义路由配置
    custom: {
        // 登录部分
        '/i/checkNickName': { ctrl: loginCtrl.checkNickName },
        '/i/checkUserName': { ctrl: loginCtrl.checkUserName },
        '/i/checkEmail': { ctrl: loginCtrl.checkEmail },
        '/i/createUser': { ctrl: loginCtrl.createUser },
        '/i/login': { ctrl: loginCtrl.login },
        // 个人中心部分
        '/i/getUserInfo': { ctrl: profileCtrl.getUserInfo, login: true },
        '/i/modifyUserInfo': { ctrl: profileCtrl.modifyUserInfo, login: true },
        // team相关
        '/i/getMyJoinTeams': { ctrl: teamCtrl.getMyJoinTeams, login: true },
        '/i/getTeamInfo': { ctrl: teamCtrl.getTeamInfo, login: true },
        '/i/modifyTeamInfo': { ctrl: teamCtrl.modifyTeamInfo, login: true },
        '/i/getAllTeams': { ctrl: teamCtrl.getAllTeams },
        // 团队成员
        '/i/addTeamMember': { ctrl: teamMemberCtrl.addTeamMember, login: true },
        '/i/getMembers': { ctrl: teamMemberCtrl.getMembers, login: true },
        '/i/deleteMember': { ctrl: teamMemberCtrl.deleteMember, login: true },
        // 标签相关
        '/i/getAllTags': { ctrl: tagCtrl.getAllTags, login: true },
        // 文章相关
        '/i/createDoc': { ctrl: docCtrl.createDoc, login: true },
        '/i/getNoPublishDocsByTeamId': { ctrl: docCtrl.getNoPublishDocsByTeamId, login: true },
        '/i/getDocsForPage': { ctrl: docCtrl.getDocsForPage }, // 首页使用不需要登录
        '/i/getMyDocs': { ctrl: docCtrl.getMyDocs, login: true },
        '/i/delMyDocById': { ctrl: docCtrl.delMyDocById, login: true },
        // 周刊相关
        '/i/createWeekly': { ctrl: weeklyCtrl.createWeekly, login: true },
        '/i/getWeeklyByTeamId': { ctrl: weeklyCtrl.getWeeklyByTeamId },
        '/i/getDocsByWeeklyId': { ctrl: weeklyCtrl.getDocsByWeeklyId },
        '/i/getWeeklyBaseInfoById': { ctrl: weeklyCtrl.getWeeklyBaseInfoById }
    }
}
