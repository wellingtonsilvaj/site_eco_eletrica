'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    //Cadastrar registros no BD
    return queryInterface.bulkInsert('AboutsCompanies', [
      {
        titleAboutsCompanies:'Comigo o serviço é feito dentro do prazo',
        descAboutsCompanies:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it h',
        imageAboutsCompanies:'premium_v6.jpg',
        situationAboutId:'1',
        createdAt: new Date(),
        updatedAt: new Date(),
        
    },
    {
      titleAboutsCompanies:'Comigo o serviço é feito dentro do prazo, com segurança e qualidade para você e sua família não terem preocupações',
      descAboutsCompanies:'It is a long established fact that a reader will be distracted by the readable content of a pag',
      imageAboutsCompanies:'premium_v2.jpg',
      situationAboutId:'1',
      createdAt: new Date(),
      updatedAt: new Date(), 
    },
      {
        titleAboutsCompanies:'Comigo o serviço é feito dentro do prazo, com segurança e qualidade para você e sua família não terem preocupações',
        descAboutsCompanies:'It is a long established fact that a reader will be distracted by the readable content of a pag',
        imageAboutsCompanies:'premium_v6.jpg',
        situationAboutId:'2',
        createdAt: new Date(),
        updatedAt: new Date(), 
      },
      {
        titleAboutsCompanies:'Comigo o serviço é feito dentro do prazo',
        descAboutsCompanies:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it h',
        imageAboutsCompanies:'premium_v2.jpg',
        situationAboutId:'1',
        createdAt: new Date(),
        updatedAt: new Date(),
        
    },
    
  ]);
  },

  async down () {

  }
};
