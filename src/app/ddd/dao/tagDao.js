const { QueryTypes } = require('sequelize')
const { sequelize } = require('../../../config/db')
const { Tag } = require('../model')
const { DocTag } = require('../model')

// 获取所有标签 - 文章发布使用
async function getAllTags () {
    const tags = await Tag.findAll()
    return tags
}
// 创建标签与文章的关联关系
async function createDocTag (docTag, options = {}) {
    const res = await DocTag.create(docTag, options)
    return res
}

// 获取文章的所有标签
async function getTagsByDocId (docId) {
    const sql = 'SELECT tag.tag_id as tagId, tag.tag_name as tagName FROM d_doc_tag dt ' +
                'LEFT JOIN d_tag tag ON tag.tag_id=dt.tag_id ' +
                'WHERE dt.doc_id=?;'
    const tags = await sequelize.query(sql, { replacements: [docId], type: QueryTypes.SELECT })
    return tags
}

// 通过docId删除文档与标签的关联关系
async function delTagRelationByDocId ({ docId, transaction }) {
    let result = await DocTag.destroy({ where: { docId }, transaction })
    return result
}

// 标签云
async function getAllTagsAndCount () {
    const sql = 'SELECT tag.tag_name as tagName,dt.tag_id as tagId, count(*) AS count FROM d_doc_tag dt ' +
                'LEFT JOIN d_tag tag ON tag.tag_id=dt.tag_id ' +
                'GROUP BY dt.tag_id ' +
                'ORDER BY count DESC;'
    const tags = await sequelize.query(sql, { type: QueryTypes.SELECT })
    return tags
}

// 获取标签下已发布的文档
async function getDocsByTagId ({ tagId, pageSize, curPage }) {
    const sql = 'SELECT doc.source_url as sourceUrl, doc.doc_id as docId, doc.title,doc.reason,doc.create_time as createTime, u.nick_name as nickName FROM d_doc_tag dt ' +
                'LEFT JOIN d_doc doc ON doc.doc_id=dt.doc_id ' +
                'LEFT JOIN d_user u ON u.user_id=doc.create_user_id ' +
                'where dt.tag_id=? and doc.status=1 ' +
                'ORDER BY doc.create_time DESC ' +
                'LIMIT ?,?;'
    const docList = await sequelize.query(sql, { replacements: [tagId, (curPage - 1) * pageSize, pageSize], type: QueryTypes.SELECT })
    return docList || []
}

module.exports = {
    getAllTags,
    createDocTag,
    getTagsByDocId,
    delTagRelationByDocId,
    getAllTagsAndCount,
    getDocsByTagId
}
