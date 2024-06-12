//Normalizar o cód, ajuda a evitar gambiarras
'use strict';

//Seeders para cadastrar registro na tabela "situations"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
//Cadastrar o registro na tabela "siituations"
return queryInterface.bulkInsert('situations', [{
  nameSituation: 'Ativo',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
    nameSituation: 'Inativo',
    createdAt: new Date(),
    updatedAt: new Date()
},
{
  nameSituation: 'Descadastrado',
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  nameSituation: 'Spam',
  createdAt: new Date(),
  updatedAt: new Date()
}]);
  },

  async down () {


  }
};
