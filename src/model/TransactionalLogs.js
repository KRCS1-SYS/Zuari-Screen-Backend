const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./UserAuth'); 

const TransactionalLogs = sequelize.define('transactional_logs', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    table_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    record_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    previous_data: {
        type: DataTypes.JSON,
        allowNull: false
    },
    new_data: {
        type: DataTypes.JSON,
        allowNull: false
    },
    performed_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',  
            key: 'id'
        }
    }
}, {
    tableName: 'transactional_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true
});


TransactionalLogs.belongsTo(User, { foreignKey: 'performed_by', as: 'user' });

module.exports = TransactionalLogs;
