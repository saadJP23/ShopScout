const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    billingAddress: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    items: {
      type: DataTypes.JSON, // [{ productId, title, size, quantity, price }]
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true, // Stripe Payment Intent for tracking
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // optional if user is not logged in
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "paid", // or pending, failed, refunded
    },
    deliveryStatus: {
      type: DataTypes.STRING,
      defaultValue: "processing", // or shipped, delivered
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = Order;
