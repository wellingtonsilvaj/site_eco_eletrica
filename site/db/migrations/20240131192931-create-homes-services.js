'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HomesServices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titleService: {
        type: Sequelize.STRING
      },
      iconOne: {
        type: Sequelize.STRING
      },
      iconTwo: {
        type: Sequelize.STRING
      },
      iconThree: {
        type: Sequelize.STRING
      },
      titleOneService: {
        type: Sequelize.STRING
      },
      titleTwoService: {
        type: Sequelize.STRING
      },
      titleThreeService: {
        type: Sequelize.STRING
      },
      descOneService: {
        type: Sequelize.STRING
      },
      descTwoService: {
        type: Sequelize.STRING
      },
      descThreeService: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HomesServices');
  }
};