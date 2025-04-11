const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('shopscout', 'root', 'SaadPakistan2013!', {
  host: 'localhost',
  port: 3306, // default MySQL port
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
