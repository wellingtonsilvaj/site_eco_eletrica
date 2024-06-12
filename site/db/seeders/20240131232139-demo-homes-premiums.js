'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    return queryInterface.bulkInsert('HomesPremiums', [
      {
      premTitle:'Serviços Premium',
      premSubtitle:' Lorem ipsum dolor sit amet consectetur adipiscing elit. Aliquam laoreet porta rhoncus.',
      premDesc:'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
      premBtn_text:'Contato',
      premBtn_link:'contato.html',
      premImage:'placa-solar.png',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  },

  async down () {

  }
};
