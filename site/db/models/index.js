//Normatizar o cód, ajuda evitar gambiarras
'use strict';

//Permite trabalhar com o sistema de arquivos do Computador
const fs = require('fs');
//Fornece utilitários para trabalhar com caminhos de arquivos e diretótios
const path = require('path');
//Sequelize é um ORM Node.js, que tem suporte vários BDs
//ORM mapeamento objeto-relacional, as tabelas do BD são representadas em classes e os registros das tabelas seriam as instâncias dessas clases
const Sequelize = require('sequelize');
//permite obter informações do processo na pagina atual
const process = require('process');
//Permite obter parte do caminho para o arquivo
const basename = path.basename(__filename);
//Verificar se deve utilizar a variavel global ou 'development'
const env = process.env.NODE_ENV || 'development';
//Incluir o arquivo
const config = require(__dirname + '/../config/database.js')[env];
//Criar a constante com objeto vazio
const db = {};

//Criar a variável que recebe conexão com o BD
let sequelize;
//Verificar qual configuração de BD voce deseja usar
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    //Usar as configurações do arquivo "config/database.json"
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

//Verificar a conexão com BD
try{
  sequelize.authenticate();
  console.log("Conexão com o Banco de Dados realizada com sucesso!");
}catch(error){
  console.log("Conexão com o Banco de Dados não realizada com sucesso! ", error);
}

//Identificar o MODEL
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

//Atribuir a conexão com banco de dados para o objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//Exportar a instrução que está dentro da constante db
module.exports = db;
