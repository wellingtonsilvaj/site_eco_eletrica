'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titleContact: {
        type: Sequelize.STRING
      },
      SubTitleContact: {
        type: Sequelize.STRING
      },
      iconCompany: {
        type: Sequelize.STRING
      },
      titleCompany: {
        type: Sequelize.STRING
      },
      descCompany: {
        type: Sequelize.STRING
      },
      iconAddress: {
        type: Sequelize.STRING
      },
      titleAdress: {
        type: Sequelize.STRING
      },
      descAddress: {
        type: Sequelize.STRING
      },
      iconEmail: {
        type: Sequelize.STRING
      },
      titleEmail: {
        type: Sequelize.STRING
      },
      descEmail: {
        type: Sequelize.STRING
      },
      titleForm: {
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
    await queryInterface.dropTable('Contacts');
  }
};