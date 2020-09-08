const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../../config/db')

class Server extends Model {}
Server.init({
    userId: {
        field: 'user_id',
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    userName: {
        field: 'user_name',
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nickName: {
        field: 'nick_name',
        type: Sequelize.STRING,
        allowNull: false
    },
    createTime: {
        field: 'create_time',
        type: Sequelize.DATE,
        allowNull: false
    },
    lastLoginTime: {
        field: 'last_login_time',
        type: Sequelize.DATE
    },
    lastModifyTime: {
        field: 'last_modify_time',
        type: Sequelize.DATE
    },
    registerRank: {
        field: 'register_rank',
        type: Sequelize.BIGINT
    }
}, {
    sequelize,
    freezeTableName: true,
    tableName: 'd_user',
    // timestamps: false,  // 去除createAt updateAt
    // 将updatedAt对应到数据库的updated_at字段
    createdAt: 'createTime',
    updatedAt: 'lastModifyTime'
})

module.exports = Server
