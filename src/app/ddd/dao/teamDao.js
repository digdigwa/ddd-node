const { QueryTypes } = require('sequelize')
const { sequelize } = require('../../../config/db')
const { Team } = require('../model')

async function getMyJoinTeams (userId) {
    const sql = 'SELECT t.team_id as teamId, t.team_name as teamName FROM d_team_user tu ' +
                'LEFT JOIN d_team t ON t.team_id=tu.team_id ' +
                'WHERE tu.user_id = ?;'
    const teamList = await sequelize.query(sql, { replacements: [userId], type: QueryTypes.SELECT })
    return teamList || []
}

// 通过teamId获取团队信息
async function getTeamByTeamId (teamId) {
    const team = await Team.findOne({ where: { teamId } })
    return team
}

// 获取所有团队
async function getAllTeams () {
    const teams = await Team.findAll()
    return teams
}

module.exports = {
    getMyJoinTeams,
    getTeamByTeamId,
    getAllTeams
}
