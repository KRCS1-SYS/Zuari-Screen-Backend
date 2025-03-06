const { DataTypes } = require('sequelize');
const sequelize = require('../db/index');

const QualityParams = sequelize.define('quality_params', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tag_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    counter_reading: { 
        type: DataTypes.DOUBLE, 
        allowNull: false 
    },
    calculated_quantity_quintal: { 
        type: DataTypes.DOUBLE, 
        allowNull: false 
    },
    last_approved_quantity: { 
        type: DataTypes.DOUBLE, 
        allowNull: false 
    },
    qa_approved_quantity: { 
        type: DataTypes.DOUBLE, 
        allowNull: false 
    },
    calculated_quality_last_reading_time: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    qa_approved_quality_last_approved_time: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    approved_by: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    posted_to_sap: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'quality_params',
    timestamps: true, 
    underscored: true 
});

module.exports = QualityParams;
