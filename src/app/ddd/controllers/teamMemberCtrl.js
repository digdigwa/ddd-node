
const dao = require('../dao/teamMemberDao')
const userDao = require('../dao/loginDao')
const { result } = require('./result')

// 获取当前用户加入了哪些团队
async function addTeamMember ({ ctx, uid }) {
    let { userName, teamId } = ctx.request.body
    if (!userName || !teamId) {
        ctx.body = result({ status: 500, message: '数据不正确' })
        return
    }
    // 用户合法性校验
    let user = await userDao.getUserByUserName(userName)
    if (!user) {
        ctx.body = result({ status: 500, message: '该用户不存在' })
        return
    }
    // 判断是否已经是团队成员
    let teamMember = await dao.getByUserIdAndTeamId({ userId: user.userId, teamId })
    if (teamMember) {
        ctx.body = result({ status: 500, message: '该用户已是团队成员' })
        return
    }

    try {
        let teams = await dao.addTeamMember({
            userId: user.userId,
            teamId,
            createTime: new Date()
        })
        ctx.body = result({ data: teams })
    } catch (error) {
        console.error(error)
        ctx.body = result({ status: 500, message: '服务异常，添加失败' })
    }
}

// 获取成员列表
async function getMembers ({ ctx, uid }) {
    let members = await dao.getMembers(ctx.query.teamId)
    ctx.body = result({ data: members })
}

// 删除成员
async function deleteMember ({ ctx, uid }) {
    let res = await dao.destroy(ctx.query.id)
    ctx.body = result({ data: res })
}

module.exports = {
    addTeamMember,
    getMembers,
    deleteMember
}
