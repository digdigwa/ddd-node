const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../../config/db')

class Server extends Model {}
Server.init({
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    teamId: {
        field: 'team_id',
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        field: 'user_id',
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
    tableName: 'd_team_user',
    timestamps: false  // 去除createAt updateAt
})

module.exports = Server
