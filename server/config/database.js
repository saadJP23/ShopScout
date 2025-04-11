const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('shopscout', 'root', 'SaadPakistan2013!', {
  host: '0.tcp.jp.ngrok.io',
  port: 16242,
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
