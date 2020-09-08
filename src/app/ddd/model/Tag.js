const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../../config/db')

class Server extends Model {}
Server.init({
    tagId: {
        field: 'tag_id',
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    tagName: {
        field: 'tag_name',
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    createUserId: {
        field: 'create_user_id',
        type: Sequelize.STRING,
        allowNull: false
    },
    createTime: {
        field: 'create_time',
        type: Sequelize.DATE,
        allowNull: false
    },
    lastModifyTime: {
        field: 'last_modify_time',
        type: Sequelize.DATE
    }
}, {
    sequelize,
    freezeTableName: true,
    tableName: 'd_tag',
    // timestamps: false,  // 去除createAt updateAt
    // 将updatedAt对应到数据库的updated_at字段
    createdAt: 'createTime',
    updatedAt: 'lastModifyTime'
})

module.exports = Server
