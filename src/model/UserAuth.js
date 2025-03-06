// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Sequelize instance

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullName: { 
        type: DataTypes.STRING 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    community: { 
        type: DataTypes.STRING 
    },
    phone: { 
        type: DataTypes.BIGINT 
    },
    profileType: { 
        type: DataTypes.STRING 
    },
    firstLogin: { 
        type: DataTypes.ENUM('true', 'false'), 
        defaultValue: 'false' 
    },
    userEmailVerified: { 
        type: DataTypes.ENUM('true', 'false'), 
        defaultValue: 'false' 
    },
    createdDate: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
}, {
    tableName: 'Users',
    timestamps: false
});

module.exports = User;
