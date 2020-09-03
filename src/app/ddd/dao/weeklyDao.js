const { Op } = require('sequelize')
const { Doc, Weekly } = require('../model')

// 周刊创建
async function createWeekly (doc, options = {}) {
    const res = await Weekly.create(doc, options)
    return res
}

// 更新weeklyId字段, 周刊发布时使用
async function updateWeeklyField ({ weeklyId, teamId, transaction }) {
    let res = await Doc.update({ weeklyId }, { where: { teamId, weeklyId: { [Op.is]: null } }, transaction })
    return res
}

// 通过团队ID查询发布的所有周刊
async function getWeeklyByTeamId (teamId) {
    const res = await Weekly.findAll({ where: { teamId } })
    return res || []
}

module.exports = {
    createWeekly,
    updateWeeklyField,
    getWeeklyByTeamId
}
