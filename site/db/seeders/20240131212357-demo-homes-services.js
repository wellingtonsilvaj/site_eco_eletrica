'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    //Cadastrar o registro na tabela "HomesServices"

  return queryInterface.bulkInsert('HomesServices', [
    {
      titleService:'Serviços',
      iconOne:'fa-solid fa-house-chimney-crack fa-shake',
      iconTwo:'fa-solid fa-building fa-fade',
      iconThree:'fa-solid fa-solar-panel fa-beat-fade',

      titleOneService:'Serviços elétricos residenciais',
      titleTwoService:'Serviços elétricos empresariais',
      titleThreeService:'Instalação de paineis <br> solares',

      descOneService:'Contrary to popular belief, Lorem Ipsum is not simply random',
      descTwoService:'Contrary to popular belief, Lorem Ipsum is not simply random',
      descThreeService:'Contrary to popular belief, Lorem Ipsum is not simply random',

      createdAt: new Date(),
      updatedAt: new Date()


    }]);
  },

  async down () {
  
  }
};
