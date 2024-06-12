//incluir as bibliotecas
//gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');
//utilizado para manipular as rotas da aplicação
const router = express.Router();
//Midleware para a implementação de autenticação
const passport = require('passport');


//criar rota pagina inicial
router.get('/', (req, res) => {
    res.render("admin/login/login", { layout: 'login'});
});

//Criar a rota para receber os dados do formulário de login e validar login
router.post('/', (req, res, next) => {
    //Utilizar o usuario e senha para validar o login
    passport.authenticate("local", {
        //redirecionar o usuario quando o login e senha estiver correto
        successRedirect: "/dashboard",
        //Redirecionar o usuario quando o login e senha estiver incorreto
        failureRedirect:"/login",
        //Receber as mensagens de erro
        failureFlash: true
    })(req, res, next);
});

//Rota para deslogar do sistema adm
router.get('/logout', (req, res) => {
    //Remover os dados do usuario da sessão
    req.logout(req.user, () => {
        //Criar a mensagem de sucesso
        req.flash("success_msg", "Deslogado com sucesso!");
        res.redirect('/login');
    });
});

//exportar a instrução que está dentro da constante router
module.exports = router;