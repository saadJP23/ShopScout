// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize('shopscout', 'root', 'SaadPakistan2013!', {
//   host: 'localhost',
//   port: 3306, // default MySQL port
//   dialect: 'mysql',
//   logging: false,
// });

// module.exports = sequelize;

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
