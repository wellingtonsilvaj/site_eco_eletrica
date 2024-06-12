//Normalizar o cód, ajuda a evitar gambiarras
'use strict';

//criptografar senha
const bcrypt = require('bcryptjs');

//Seeders para cadastrar registro na tabela "users"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    //Cadastrar o registro na tabela "users"
    return queryInterface.bulkInsert('users', [{
      name: 'José Santos',
      email: 'jose@jose.com.br',
      situationId: 1,
      password: await bcrypt.hash('123456',8),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
    name: 'jandelson',
    email: 'jandelson@jandelson.com.br',
    situationId: 1,
    password: await bcrypt.hash('123456',8),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Ana Maria',
    email: 'ana@ana.com.br',
    situationId: 1,
    password: await bcrypt.hash('123456',8),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'maria',
    email: 'maria@maria.com.br',
    situationId: 1,
    password: await bcrypt.hash('123456',8),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'genival Santos',
    email: 'genival@genival.com.br',
    situationId: 1,
    password: await bcrypt.hash('123456',8),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'wellington',
    email: 'wellington@wellington.com.br',
    situationId: 1,
    password: await bcrypt.hash('123456',8),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Debora Santos',
    email: 'debora@debora.com.br',
    situationId: 1,
    password: await bcrypt.hash('123456',8),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'mateus Santos',
    email: 'mateus@mateus.com.br',
    situationId: 1,
    password: await bcrypt.hash('123456',8),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'camila',
    email: 'camila@camila.com.br',
    situationId: 1,
    password: await bcrypt.hash('123456',8),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'mario',
    email: 'mario@mario.com.br',
    situationId: 1,
    password: await bcrypt.hash('123456',8),
    createdAt: new Date(),
    updatedAt: new Date()
  },
    
  ]);
  },
  

  async down () {
   
  }
};
