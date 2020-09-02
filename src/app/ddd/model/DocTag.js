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
    tagId: {
        field: 'tag_id',
        type: Sequelize.STRING,
        allowNull: false
    },
    docId: {
        field: 'doc_id',
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    freezeTableName: true,
    tableName: 'd_doc_tag',
    timestamps: false  // 去除createAt updateAt
})

module.exports = Server
