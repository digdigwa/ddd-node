const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../../config/db')

class Server extends Model {}
Server.init({
    teamId: {
        field: 'team_id',
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    teamName: {
        field: 'team_name',
        type: Sequelize.STRING,
        allowNull: false
    },
    coverUrl: {
        field: 'cover_url',
        type: Sequelize.STRING,
        allowNull: false
    },
    introduction: {
        type: Sequelize.STRING
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
    lastModigyTime: {
        field: 'last_modify_time',
        type: Sequelize.DATE
    }
}, {
    sequelize,
    freezeTableName: true,
    tableName: 'd_team',
    // timestamps: false,  // 去除createAt updateAt
    // 将updatedAt对应到数据库的updated_at字段
    createdAt: 'createTime',
    updatedAt: 'lastModigyTime'
})

module.exports = Server
