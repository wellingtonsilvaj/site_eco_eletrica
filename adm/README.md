COMO RODAR O PROJETO BAIXADO
Instalar todas as dependencias indicada pelo package.json
### npm install

Criar a base de dados no MySQL
Alterar as credenciais do banco de dados no arquivo ".env"

Executar as migrations
### npx sequelize-cli db:migrate

Executar as seeders
### npx sequelize-cli db:seed:all

Rodar o projeto usando o nodemon
### nodemon app.js

Abrir o endereço no navegador para acessar a página de login
### http://localhost:8080/login


