const { sequelize } = require('../../../config/db')
const tools = require('../../../common/tools')
const dao = require('../dao/weeklyDao')
const { result } = require('./result')
const { getLogger } = require('../../../common/log/log')
const logger = getLogger()

async function createWeekly ({ ctx, uid }) {
    let data = ctx.request.body
    // 创建周刊
    let weekly = {
        weeklyId: tools.getUUID(),
        weeklyTitle: data.weeklyTitle,
        coverUrl: data.coverUrl,
        teamId: data.teamId,
        createUserId: uid,
        createTime: new Date()
    }
    let transaction
    try {
        transaction = await sequelize.transaction()
        // 周刊创建
        await dao.createWeekly(weekly, { transaction })
        // 更新文档的weeklyId字段
        await dao.updateWeeklyField({
            teamId: weekly.teamId,
            weeklyId: weekly.weeklyId,
            transaction
        })
        // commit
        await transaction.commit()
        ctx.body = result({ data: true })
    } catch (err) {
        logger.error(ctx, err)
        // Rollback transaction only if the transaction object is defined
        if (transaction) await transaction.rollback()
        ctx.body = result({ status: 500, message: '系统异常，新增失败 ' })
    }
}

// 获取所有已发布的周刊
async function getWeeklyByTeamId ({ ctx, uid }) {
    let weeklyList = await dao.getWeeklyByTeamId(ctx.query.teamId)
    ctx.body = result({ data: weeklyList })
}

module.exports = {
    createWeekly,
    getWeeklyByTeamId
}
