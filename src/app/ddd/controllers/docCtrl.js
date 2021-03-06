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
    // 如果未关联团队，则直接发布
    if (!data.teamId) {
        doc.status = 1
    }
    // 事务处理
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
            let [curTag, status] = await Tag.findOrCreate({
                where: { tagName: tag },
                defaults: {
                    tagId,
                    tagName: tag,
                    createUserId: uid
                },
                transaction
            })
            // 已存在则使用之前的ID
            if (!status) {
                tagId = curTag.tagId
            }
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
    let res = []
    // 遍历获取对应的标签
    for (let i = 0; i < docs.length; i++) {
        const doc = docs[i]
        let tags = await tagDao.getTagsByDocId(doc.docId)
        res.push({ doc, tags })
    }

    ctx.body = result({ data: res })
}

// 获取未发布的文章
async function getNoPublishDocsByTeamId ({ ctx, uid }) {
    let docs = await dao.getNoPublishDocsByTeamId(ctx.query.teamId)
    let res = []
    // 遍历获取对应的标签
    for (let i = 0; i < docs.length; i++) {
        const doc = docs[i]
        let tags = await tagDao.getTagsByDocId(doc.docId)
        res.push({ doc, tags })
    }
    ctx.body = result({ data: res })
}

// 获取所有我推荐的文档
async function getMyDocs ({ ctx, uid }) {
    let { curPage, pageSize } = ctx.request.body
    let docs = await dao.getMyDocs({ curPage, pageSize, userId: uid })
    let res = []
    // 遍历获取对应的标签
    for (let i = 0; i < docs.length; i++) {
        const doc = docs[i]
        let tags = await tagDao.getTagsByDocId(doc.docId)
        res.push({ doc, tags })
    }
    ctx.body = result({ data: res })
}

// 删除个人推荐的文章
async function delMyDocById ({ ctx, uid }) {
    // 事务处理
    let transaction
    try {
        transaction = await sequelize.transaction()
        // 删除文章
        await dao.delMyDocById({
            createUserId: uid,
            docId: ctx.query.docId,
            transaction
        })
        // 删除文章对应的标签关联
        await tagDao.delTagRelationByDocId({
            docId: ctx.query.docId,
            transaction
        })

        await transaction.commit()
        ctx.body = result({ data: true })
    } catch (error) {
        logger.error(ctx, error)
        // Rollback transaction only if the transaction object is defined
        if (transaction) await transaction.rollback()
        ctx.body = result({ message: '数据异常，删除失败', status: 500 })
    }
}

// 根据title模糊查找文章
async function docSearch ({ ctx, uid }) {
    let { title, pageSize, curPage } = ctx.request.body
    let docs = await dao.docSearch({ title, pageSize, curPage })
    let res = []
    // 遍历获取对应的标签
    for (let i = 0; i < docs.length; i++) {
        const doc = docs[i]
        let tags = await tagDao.getTagsByDocId(doc.docId)
        res.push({ doc, tags })
    }
    ctx.body = result({ data: res })
}

module.exports = {
    createDoc,
    getDocsForPage,
    getNoPublishDocsByTeamId,
    getMyDocs,
    delMyDocById,
    docSearch
}
