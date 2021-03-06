const { QueryTypes, Op } = require('sequelize')
const { sequelize } = require('../../../config/db')
const { Doc, Weekly } = require('../model')

// 周刊创建
async function createWeekly (doc, options = {}) {
    const res = await Weekly.create(doc, options)
    return res
}

// 创建文档
async function createDoc (doc, options = {}) {
    const res = await Doc.create(doc, options)
    return res
}

// 文档分页查询，首页使用
async function getDocsForPage ({ pageSize, curPage }) {
    const sql = 'SELECT doc.source_url as sourceUrl, doc.doc_id as docId, doc.title,doc.reason,doc.create_time as createTime, u.nick_name as nickName FROM d_doc doc ' +
                'LEFT JOIN d_user u ON doc.create_user_id=u.user_id ' +
                'where doc.status=1 ' +
                'ORDER BY doc.create_time DESC ' +
                'LIMIT ?,?;'
    const docList = await sequelize.query(sql, { replacements: [(curPage - 1) * pageSize, pageSize], type: QueryTypes.SELECT })
    return docList || []
}

// 查询指定团队还未发布的文档
async function getNoPublishDocsByTeamId (teamId) {
    // const res = await Doc.findAll({ where: { teamId, weeklyId: '' } })
    // return res
    const sql = 'SELECT doc.source_url as sourceUrl, doc.doc_id as docId, doc.title,doc.reason,doc.create_time as createTime, u.nick_name as nickName FROM d_doc doc ' +
                'LEFT JOIN d_user u ON doc.create_user_id=u.user_id ' +
                'where doc.status=0 and doc.team_id=? ' +
                'ORDER BY doc.create_time DESC;'
    const docList = await sequelize.query(sql, { replacements: [teamId], type: QueryTypes.SELECT })
    return docList || []
}

// 更新weeklyId字段, 周刊发布时使用
async function updateWeeklyField ({ weeklyId, teamId, transaction }) {
    let res = await Doc.update({ weeklyId }, { where: { teamId, weeklyId: '' }, transaction })
    return res
}

// 通过周刊ID查询所有文档
async function getDocsByWeeklyId (weeklyId) {
    // let res = await Doc.findAll({ where: { weeklyId } })
    // 关联出人员nickName
    const sql = 'SELECT doc.source_url as sourceUrl, doc.doc_id as docId, doc.title,doc.reason,doc.create_time as createTime, u.nick_name as nickName FROM d_doc doc ' +
                'LEFT JOIN d_user u ON doc.create_user_id=u.user_id ' +
                'where doc.weekly_id=? ' +
                'ORDER BY doc.create_time DESC;'
    const docList = await sequelize.query(sql, { replacements: [weeklyId], type: QueryTypes.SELECT })
    return docList || []
}

// 通过用户ID查询所有文档 - 个人中心-我的推荐
async function getMyDocs ({ userId, pageSize, curPage }) {
    const sql = 'SELECT doc.source_url as sourceUrl,doc.status, doc.doc_id as docId, doc.title,doc.reason,doc.create_time as createTime, u.nick_name as nickName FROM d_doc doc ' +
                'LEFT JOIN d_user u ON doc.create_user_id=u.user_id ' +
                'where doc.create_user_id=? ' +
                'ORDER BY doc.create_time DESC ' +
                'LIMIT ?,?;'
    const docList = await sequelize.query(sql, { replacements: [userId, (curPage - 1) * pageSize, pageSize], type: QueryTypes.SELECT })
    return docList || []
}

// 通过创建人ID删除文档
async function delMyDocById ({ docId, createUserId, transaction }) {
    let result = await Doc.destroy({ where: { docId, createUserId }, transaction })
    return result
}

// 按文章title模糊查找
async function docSearch ({ title, pageSize, curPage }) {
    let result = await Doc.findAll({
        where: {
            title: { [Op.like]: `%${title}%` },
            status: 1
        },
        offset: (curPage - 1) * pageSize,
        limit: pageSize
    })
    return result || []
}

module.exports = {
    createWeekly,
    createDoc,
    getDocsForPage,
    getNoPublishDocsByTeamId,
    updateWeeklyField,
    getDocsByWeeklyId,
    getMyDocs,
    delMyDocById,
    docSearch
}
