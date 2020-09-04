const { QueryTypes } = require('sequelize')
const { sequelize } = require('../../../config/db')
const { Op } = require('sequelize')
const { Doc, Weekly } = require('../model')

// 周刊创建
async function createWeekly (doc, options = {}) {
    const res = await Weekly.create(doc, options)
    return res
}

// 更新weeklyId字段, 周刊发布时使用
async function updateWeeklyField ({ weeklyId, teamId, transaction }) {
    let res = await Doc.update({ weeklyId, status: 1 }, { where: { teamId, weeklyId: { [Op.is]: null } }, transaction })
    return res
}

// 通过团队ID查询发布的所有周刊
async function getWeeklyByTeamId (teamId) {
    // const res = await Weekly.findAll({ where: { teamId } })
    // 需要关联出用户中文名
    const sql = 'SELECT w.weekly_id as weeklyId, w.weekly_title as weeklyTitle, w.cover_url as coverUrl, w.create_time as createTime, u.nick_name as nickName ' +
                'FROM d_weekly w ' +
                'LEFT JOIN d_user u ON u.user_id=w.create_user_id ' +
                'WHERE team_id =?;'
    const res = await sequelize.query(sql, { replacements: [teamId], type: QueryTypes.SELECT })
    return res || []
}

// 通过周刊ID查询周刊基本信息
async function getWeeklyBaseInfoById (weeklyId) {
    // const res = await Weekly.findOne({ where: { weeklyId } })
    // 需要关联出用户中文名
    const sql = 'SELECT w.weekly_id as weeklyId, w.weekly_title as weeklyTitle, w.cover_url as coverUrl, w.create_time as createTime, u.nick_name as nickName ' +
                'FROM d_weekly w ' +
                'LEFT JOIN d_user u ON u.user_id=w.create_user_id ' +
                'WHERE weekly_id =?;'
    const res = await sequelize.query(sql, { replacements: [weeklyId], type: QueryTypes.SELECT })
    return res
}

module.exports = {
    createWeekly,
    updateWeeklyField,
    getWeeklyByTeamId,
    getWeeklyBaseInfoById
}
