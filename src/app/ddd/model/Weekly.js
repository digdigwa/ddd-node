const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../../config/db')

class Server extends Model {}
Server.init({
    weeklyId: {
        field: 'weekly_id',
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    weeklyTitle: {
        field: 'weekly_title',
        type: Sequelize.STRING,
        allowNull: false
    },
    coverUrl: {
        field: 'cover_url',
        type: Sequelize.STRING,
        allowNull: false
    },
    teamId: {
        field: 'team_id',
        type: Sequelize.STRING,
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
    }
}, {
    sequelize,
    freezeTableName: true,
    tableName: 'd_weekly',
    timestamps: false  // 去除createAt updateAt
})

module.exports = Server
