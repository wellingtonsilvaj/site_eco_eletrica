'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    return queryInterface.bulkInsert('ContactsMsgs', [
      // Cadastrar o registro na tabela "ContactsMsgs"
      {
        name:'wellington santos',
        email:'wellington@wellington.com.br',
        subject:'valor do serviço',
        content:'Lorem Ipsum is simply dummy text of the  the industry',
        createdAt:new Date(),
        updatedAt: new Date(),
      },
      {
        name:'ana maria',
        email:'ana@ana.com.br',
        subject:'orçamento',
        content:'Lorem Ipsum is simply dummy text of the  the industry',
        createdAt:new Date(),
        updatedAt: new Date(),
    },
    {
        name:'jorge almeida',
        email:'jorge@jorge.com.br',
        subject:'reforma',
        content:'Lorem Ipsum is simply dummy text of the  the industry',
        createdAt:new Date(),
        updatedAt: new Date()
    
      }]);

  },

  async down () {

  }
};
