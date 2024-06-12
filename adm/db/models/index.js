//Normatizar o cod, ajuda evitar gambiarras
'use strict';

//Permite trabalhar com o sistema de arquivos do PC
const fs = require('fs');
//Fornece utilitarios para trabalhar com caminhos de arquivos e diretorios
const path = require('path');
//Sequelize é um ORM para Node.js, que tem suporte varios BD
//ORM mapeamento objeto-relacional, as tabelas do BD são representadas em classes e os registros das tabelas seriam instancias dessas classes
const Sequelize = require('sequelize');
//Permite obter informações do processo na pagina atual
const process = require('process');
//Permite obter parte do caminho para o arquivo
const basename = path.basename(__filename);
//Verificar se deve utilizar a variável global ou 'development'
const env = process.env.NODE_ENV || 'development';
//Incluir aquivo
const config = require(__dirname + '/../config/database.js')[env];
//Criar a constante com objeto vazio
const db = {};

//Criar a variavel que recebe a conexão com BD
let sequelize;
//Verificar qual config de BD você deseja usar
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  //Usar as configs do arquivo "config/database.json"
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

//Verificar conexão com o BD
try {
  sequelize.authenticate();
  console.log('Conexão com o BANCO DE DADOS REALIZADA COM SUCESSO!');  
} catch (error) {
  console.error('ERRO: Conexão com o BANCO DE DADOS NÃO REALIZADA COM SUCESSO!', error);
}

//Indentificar o MODEL
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
//Atribuir a conexão com o BD para o objeto DB
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Exportar a instrução que está dentro da constante DB
module.exports = db;
