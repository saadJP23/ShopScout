const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('shopscout', 'root', 'SaadPakistan2013!', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
