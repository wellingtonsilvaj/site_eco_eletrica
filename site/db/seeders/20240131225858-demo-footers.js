'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    // Cadastrar o registro na tabela "footers"
    return queryInterface.bulkInsert('Footers', [
      {
      footerDesc:'Created By ',
      footerTextLink:'href="https://www.facebook.com/EcoEletrica2',
      footerLink:'EcoElétrica',
      createdAt: new Date(),
      updatedAt:new Date()
    }]);

  },

  async down () {

  }
};
