'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    return queryInterface.bulkInsert('Contacts', [
      //Cadastrar o registro na tabela "Contacts"
      {
        titleContact:'Contato',
        SubTitleContact:'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
        iconCompany:'fa-solid fa-user-large fa-beat',
        titleCompany:'Empresa',
        descCompany:'Eco Eletrica',
        iconAddress:'fa-solid fa-location-dot fa-beat',
        titleAdress:'Endereço',
        descAddress:'Camocim de são felix',
        iconEmail:'fa-solid fa-envelope-open-text fa-beat',
        titleEmail:'E-mail',
        descEmail:'eco@eletrica.com.br',
        titleForm:'Mensagem de contato',
        createdAt: new Date(),
        updatedAt: new Date()
          }
  ])
  },

  async down () {
 
  }
};
