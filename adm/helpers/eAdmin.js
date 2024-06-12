module.exports = {
    //Função para verificar se o usuário está autenticado ou não
    eAdmin: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            //Redirecionar o usuario não logado para a pagina de login
            req.flash("danger_msg", "ERRO: Necessário realizar o login para acessar a página solicitada!");
            res.redirect('/login');
        }
    }
}