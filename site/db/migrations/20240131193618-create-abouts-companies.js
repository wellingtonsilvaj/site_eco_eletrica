'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AboutsCompanies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titleAboutsCompanies: {
        type: Sequelize.STRING
      },
      descAboutsCompanies: {
        type: Sequelize.TEXT
      },
      imageAboutsCompanies: {
        type: Sequelize.STRING
      },
      situationAboutId: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 2,
        references: { model: 'SituationsAbouts', key: 'id' }
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
    await queryInterface.dropTable('AboutsCompanies');
  }
};