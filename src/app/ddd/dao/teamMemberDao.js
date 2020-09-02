const { QueryTypes } = require('sequelize')
const { sequelize } = require('../../../config/db')
const { TeamUser } = require('../model')

// 创建团队
async function addTeamMember (teamMember) {
    const res = await TeamUser.create(teamMember)
    return res
}

async function getByUserIdAndTeamId ({ userId, teamId }) {
    const member = await TeamUser.findOne({ where: { userId, teamId } })
    return member
}

// 获取团队成员
async function getMembers (teamId) {
    const sql = 'SELECT tu.id, u.nick_name as nickName, u.user_name as userName, u.user_id as userId FROM d_team_user tu ' +
                'LEFT JOIN d_user u ON tu.user_id=u.user_id ' +
                'WHERE tu.team_id=?;'
    const members = await sequelize.query(sql, { replacements: [teamId], type: QueryTypes.SELECT })
    return members || []
}

// 通过ID删除
async function destroy (id) {
    let result = await TeamUser.destroy({ where: { id } })
    return result
}

module.exports = {
    addTeamMember,
    getByUserIdAndTeamId,
    getMembers,
    destroy
}
