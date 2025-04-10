const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
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
      type: DataTypes.JSON, // Still using JSON for purchase history
      defaultValue: [],
    },
    cart: {
      type: DataTypes.JSON, // or TEXT if your DB doesn't support JSON
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
