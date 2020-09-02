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

module.exports = {
    getAllTags,
    createDocTag
}
