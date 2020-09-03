const { QueryTypes } = require('sequelize')
const { sequelize } = require('../../../config/db')
const { Tag } = require('../model')
const { DocTag } = require('../model')

// 获取所有标签
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

module.exports = {
    getAllTags,
    createDocTag,
    getTagsByDocId
}
