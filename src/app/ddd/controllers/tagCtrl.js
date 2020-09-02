
const dao = require('../dao/tagDao')
const { result } = require('./result')

// 获取所有标签
async function getAllTags ({ ctx, uid }) {
    let tags = await dao.getAllTags()
    ctx.body = result({ data: tags })
}

module.exports = {
    getAllTags
}
