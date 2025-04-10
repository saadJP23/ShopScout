const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  history: {
    type: DataTypes.JSON, // Array of objects
    defaultValue: [],
  },
  cart: {
    type: DataTypes.JSON, // Array of objects with _id and quantity
    defaultValue: [],
  }
}, {
  timestamps: true,
});

module.exports = User;
