const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CartItem = sequelize.define("CartItem", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Products",
      key: "id",
    },
  },

  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = CartItem;
