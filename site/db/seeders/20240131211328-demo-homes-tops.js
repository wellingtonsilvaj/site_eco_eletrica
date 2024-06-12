'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    //Cadastrar registros no BD
    return queryInterface.bulkInsert('HomesTops', [{
      titleOneTop:'Eco-Eletrica',
      titleTwoTop:'Temos a solução',
      titleThreeTop:'que a sua empresa precisa Podemos ajudar a sua empresa!',
      linkBtnTop:'https://www.facebook.com/login/?',
      txtBtnTop:'Entre em contato',
      imageTop:'banner_top_v7.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);
  },

  async down () {
 
  }
};
