//incluir as bibliotecas
//Gerencia as requisições, rotas e URLs, entre outra funcionalidades
const express = require('express');
//Handlebars é um processador de templates que gera a pág HTML de forma dinamica
const {engine} = require('express-handlebars');
//Incluir o módulo para gerenciar diretórios e caminhos
const path = require("path");
//Criar sessão e armazenar dados no servidor
const session = require('express-session');
//Criar a variavel global dentro do flash
const flash = require('connect-flash');
//Chamar a função express
const app = express();

//Criar o middleware para ler a entrada de um formulário e a armazenar como um objeto JS acessível por meio do req.body
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//criar um middleware para executar a sessão
app.use(session({
    secret: 'sapdiouydhjbnxczmb5527465',
    resave: false, 
    saveUninitialized: true
}));

//Usar o flash para armazenar mensagens na sessão
app.use(flash());

//Criar o middleware para manipular as mensagens
app.use((req, res, next) => {
    //Locals usado para criar váriavel global "success_msg"
    res.locals.success_msg = req.flash('success_msg');
    //Locals usado para criar váriavel global "success_msg"
    res.locals.danger_msg = req.flash('danger_msg');

    //Caso não de erro, continue o processamento, o next é obrigatório no middleware
    next();
});
 
//Definir qual template será utilizado
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//Local dos arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

/**teste de conexão com BD */
const db = require('./db/models/index');

//Incluir as controllers
const home = require('./controllers/home');
const sobre = require('./controllers/sobre');
const contato = require('./controllers/contato');
//const session = require('express-session');

//Indicar as rota
app.use('/', home);
app.use('/sobre', sobre);
app.use('/contato', contato);

app.listen(8081, () => {
    console.log("Servidor iniciado na porta 8081: http://localhost:8081");
}); 