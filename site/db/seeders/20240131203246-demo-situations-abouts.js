'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    //Cadastrar o registro na tabela "situationsAbouts"
    return queryInterface.bulkInsert('SituationsAbouts', [
      {
        nameSituation: 'Ativo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nameSituation: 'inativo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down () {

  }
};
