
const dao = require('../dao/tagDao')
const { result } = require('./result')

// 获取所有标签
async function getAllTags ({ ctx, uid }) {
    let tags = await dao.getAllTags()
    ctx.body = result({ data: tags })
}

// 标签首页-标签云使用
async function getAllTagsAndCount ({ ctx, uid }) {
    let tags = await dao.getAllTagsAndCount()
    ctx.body = result({ data: tags })
}

// 根据标签ID获取该标签下的所有文档
async function getDocsByTagId ({ ctx, uid }) {
    let { tagId, curPage, pageSize } = ctx.request.body
    let docs = await dao.getDocsByTagId({ tagId, curPage, pageSize })
    ctx.body = result({ data: docs })
}

module.exports = {
    getAllTags,
    getAllTagsAndCount,
    getDocsByTagId
}
