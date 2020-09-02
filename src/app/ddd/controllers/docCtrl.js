const { sequelize } = require('../../../config/db')
const tools = require('../../../common/tools')
const { Tag } = require('../model')
const dao = require('../dao/docDao')
const tagDao = require('../dao/tagDao')
const { result } = require('./result')
const { getLogger } = require('../../../common/log/log')
const logger = getLogger()

// 创建文档
async function createDoc ({ ctx, uid }) {
    let data = ctx.request.body
    // 文章创建
    let doc = {
        docId: tools.getUUID(),
        title: data.title,
        sourceUrl: data.sourceUrl,
        teamId: data.teamId,
        reason: data.reason,
        createUserId: uid
    }
    let transaction
    try {
        // get transaction
        transaction = await sequelize.transaction()

        // // step 1
        // await Model.destroy({ where: { id }, transaction })
        // // step 2
        // await Model.create({}, { transaction })
        // // step 3
        // await Model.update({}, { where: { id }, transaction })

        // 文章创建
        let docObj = await dao.createDoc(doc, { transaction })
        let tags = data.tags
        for (let i = 0; i < tags.length; i++) {
            let tag = tags[i]
            // 判断标签是否存在，没有则创建
            let tagId = tools.getUUID()
            await Tag.findOrCreate({
                where: { tagName: tag },
                defaults: {
                    tagId,
                    tagName: tag,
                    createUserId: uid
                },
                transaction
            })
            // 新增文章与标签的关联关系
            await tagDao.createDocTag({ tagId, docId: docObj.docId }, { transaction })
        }

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

// 首页获取文档接口
async function getDocsForPage ({ ctx, uid }) {
    let { curPage, pageSize } = ctx.request.body
    let docs = await dao.getDocsForPage({ curPage, pageSize })
    ctx.body = result({ data: docs })
}

// 获取未发布的文章
async function getNoPublishDocsByTeamId ({ ctx, uid }) {
    let docs = await dao.getNoPublishDocsByTeamId(ctx.query.teamId)
    ctx.body = result({ data: docs })
}

// 获取所有周刊文章
async function getDocsByWeeklyId ({ ctx, uid }) {
    let docs = await dao.getDocsByWeeklyId(ctx.query.weeklyId)
    ctx.body = result({ data: docs })
}

module.exports = {
    createDoc,
    getDocsForPage,
    getNoPublishDocsByTeamId,
    getDocsByWeeklyId
}
