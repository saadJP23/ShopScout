'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "cart", {
      type: Sequelize.JSON, // or Sequelize.TEXT if your DB doesn’t support JSON
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "cart");
  },
};
