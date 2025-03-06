const { DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const Machine = sequelize.define('machine_config', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    machine_name: { type: DataTypes.STRING },
    machine_type: { type: DataTypes.STRING },
    machine_grade: { type: DataTypes.STRING },
    bagSize: { type: DataTypes.STRING },
    updatedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    createdDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    createdBy: { type: DataTypes.STRING }
}, {
    tableName: 'machine_config',
    timestamps: false
});

module.exports = Machine;
