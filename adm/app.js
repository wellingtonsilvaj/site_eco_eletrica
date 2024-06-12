//incluir o arquivo com as variaveis de ambiente
require('dotenv').config();

//incluir as bibliotecas
//gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');
//handlebars é um processador de templates que gera a página html de forma dinamica
const { engine } = require('express-handlebars');
// Incluir o módulo para gerenciar diretorios e caminhos
const path = require("path");
//Criar sessão e armazenar dados no servidor
const session = require('express-session');
//Criar a variável global dentro do flash
const flash = require('connect-flash');
//Middleware para implementação de autenticação
const passport = require('passport');
//Chamar função responsável em validar o usuario e senha
require('./helpers/auth')(passport);
//Moment é utilizado para manipular datas
const moment = require('moment');
//chamar função express
const app = express();

//Criar o middleware para ler a entrada de um formulário e a armazenar como um objeto JS acessivel por meio do req.body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Criar um middleware para manipular sessão
app.use(session({
    secret: process.env.SECRETSESSION,
    resave: false,
    saveUninitialized: true
}));

//Inicializar o passport e a sessão
app.use(passport.initialize());
app.use(passport.session());

//Usar o flash para armazenar mensagens na sessão
app.use(flash());

//Usar o flash para armazenar mensagens na sessão
app.use(flash());

//Criar o middleware para manipular as mensagens
app.use((req, res, next) => {
    //Locais usado para criar váriavel global "success_msg"
    res.locals.success_msg = req.flash('success_msg');
    //Locais usado para criar váriavel global "warning_msg"
    res.locals.warning_msg = req.flash('warning_msg');
    //Locais usado para criar váriavel global "error_msg"
    res.locals.danger_msg = req.flash('danger_msg');
    //Locais usado para criar váriavel global "error"
    res.locals.error_msg = req.flash('error');
    //Caso não de erro, continue o processamento, o next é obrigatorio no middleware
    next();
});
//definir qual templete será utilizado
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//local dos arquivos estaticos
app.use(express.static(path.join(__dirname,"public")));

//Criar um middleware para manipular datas utilizando o moment
app.engine('handlebars', engine({
    helpers: {
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY');
        },
        formatDateTime: (date) => {
            return moment(date).format('DD/MM/YYYY HH:mm:ss');
        }
    }
}));

//const env = process.env.NODE_ENV || 'development';
//const config = require(__dirname + '/db/config/database.js')[env];

//Incluir o arquivo que possui a conexão com BD
const db = require('./db/models/index');


//incluir controllers
const home = require('./controllers/home');
const login = require('./controllers/login');
const newUser = require('./controllers/newUser');
const confEmail = require('./controllers/confEmail');
const dashboard = require('./controllers/dashboard');
const recoverPassword = require('./controllers/recoverPassword');
const users = require('./controllers/users');
const situations = require('./controllers/situations');
const profile = require('./controllers/profile');

const homeTop = require('./controllers/homeTop');
const contact = require('./controllers/contact');
const footer = require('./controllers/footer');
const situationsAbouts = require('./controllers/situationsAbouts');
const aboutsCompanies = require('./controllers/aboutsCompanies');
const contactsMsgs = require('./controllers/contactsMsgs');


//indicar a rota de acesso
app.use('/', home);
app.use('/login', login);
app.use('/login/logout', login);
app.use('/new-user', newUser);
app.use('/new-user/add-user', newUser);
app.use('/conf-email', confEmail);
app.use('/conf-email/new-conf-email', confEmail);
app.use('/recover-password', recoverPassword);
app.use('/recover-password/update-password', recoverPassword);

app.use('/dashboard', dashboard);

app.use('/users', users);
app.use('/users/view', users);
app.use('/users/add', users);
app.use('/users/edit', users);
app.use('/users/edit-password', users);
app.use('/users/edit-image', users);
app.use('/users/delete', users);

app.use('/situations', situations);
app.use('/situations/view', situations);
app.use('/situations/add', situations);
app.use('/situations/edit', situations);
app.use('/situations/delete', situations);

app.use('/profile', profile);
app.use('/profile/edit', profile);
app.use('/profile/edit-password', profile);
app.use('/profile/edit-image', profile);

app.use('/home-site', homeTop);
app.use('/home-site/edit-top', homeTop);
app.use('/home-site/edit-top-image', homeTop);
app.use('/home-site/edit-serv', homeTop);
app.use('/home-site/edit-prem', homeTop);
app.use('/home-site/edit-prem-image', homeTop);

app.use('/contact-site', contact);
app.use('/contact-site/edit-contact', contact);

app.use('/footer-site', footer);
app.use('/footer-site/edit', footer);

app.use('/situations-abouts-site', situationsAbouts);
app.use('/situations-abouts-site/edit', situationsAbouts);
app.use('/situations-abouts-site/delete', situationsAbouts);
app.use('/situations-abouts-site/add', situationsAbouts);

app.use('/abouts-companies-site', aboutsCompanies);
app.use('/abouts-companies-site/edit', aboutsCompanies);
app.use('/abouts-companies-site/delete', aboutsCompanies);
app.use('/abouts-companies-site/edit-image', aboutsCompanies);
app.use('/abouts-companies-site/add', aboutsCompanies);

app.use('/contacts-msgs', contactsMsgs);


//iniciar o servidor na porta 8080
app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});