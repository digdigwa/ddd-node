
const dao = require('../dao/teamDao')
const { result } = require('./result')

// 获取当前用户加入了哪些团队
async function getMyJoinTeams ({ ctx, uid }) {
    let teams = await dao.getMyJoinTeams(uid)
    ctx.body = result({ data: teams })
}

// 获取团队信息
async function getTeamInfo ({ ctx, uid }) {
    let team = await dao.getTeamByTeamId(ctx.query.teamId)
    if (team) {
        ctx.body = result({ data: team })
    } else {
        ctx.body = result({ status: 404, message: '无记录' })
    }
}

// 团队信息修改
async function modifyTeamInfo ({ ctx, uid }) {
    let { teamId, teamName, coverUrl, introduction } = ctx.request.body
    let team = await dao.getTeamByTeamId(teamId)
    if (team) {
        team.teamName = teamName
        team.coverUrl = coverUrl
        team.introduction = introduction
        try {
            await team.save()
            ctx.body = result({ data: true })
        } catch (error) {
            console.error(error)
            ctx.body = result({ status: 500, message: '系统异常，稍后再试' })
        }
    } else {
        ctx.body = result({ status: 500, message: '找不到该Team' })
    }
}

// 获取所有团队列表
async function getAllTeams ({ ctx, uid }) {
    let teams = await dao.getAllTeams()
    ctx.body = result({ data: teams })
}

module.exports = {
    getMyJoinTeams,
    getTeamInfo,
    modifyTeamInfo,
    getAllTeams
}
