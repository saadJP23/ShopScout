const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    product_unique_id: {
      type: DataTypes.STRING,
      unique: {
        name: "product_unique_id", // Explicit name
        msg: "Product unique ID must be unique",
      },

      allowNull: false,
    },
    product_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checkd: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sold: {
      type: DataTypes.JSON, // [{ size: "M", units: 1 }, ...]
      defaultValue: [],
    },

    season: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sizes: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Product;
