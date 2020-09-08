const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../../config/db')

class Server extends Model {}
Server.init({
    docId: {
        field: 'doc_id',
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sourceUrl: {
        field: 'source_url',
        type: Sequelize.STRING,
        allowNull: false
    },
    reason: {
        type: Sequelize.STRING,
        allowNull: false
    },
    teamId: {
        field: 'team_id',
        type: Sequelize.STRING,
        allowNull: false
    },
    weeklyId: {
        field: 'weekly_id',
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.INTEGER
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
    tableName: 'd_doc',
    // timestamps: false,  // 去除createAt updateAt
    // 将updatedAt对应到数据库的updated_at字段
    createdAt: 'createTime',
    updatedAt: 'lastModifyTime'
})

module.exports = Server
