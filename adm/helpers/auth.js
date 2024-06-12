//Validar o usuário e a senha com dados locais
const localStrategy = require('passport-local').Strategy;
//Criptografar senha
const bcryptjs = require('bcryptjs');
//Incluir o arquivo que possui a conexão com BD
const db = require('./../db/models');

//Criar função para validar o login e a senha e exportar para utilizar em outras partes do projeto
module.exports = function (passport) {
    passport.use(new localStrategy({
        //Receber os dados dos campos
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        //Recuperar as informações dos usuarios do BD
        const user = await db.users.findOne({
             //indicar quais colunas recuperar
        attributes: ['id', 'password', 'situationId'],
            //Indicar qual registro deve ser retornado do BD
            where: {
                email
            }
        }).then(async (user) => {
            //Acessa o if quando não encontrar o usuario no BD
            if(!user){
                return done(null, false, {message: "ERRO: E-mail ou senha incorreta! "});
            }

            //Comparar a senha do formulário coma senha salva no BD
            bcryptjs.compare(password, user.password, (erro, correct) => {

                //Acessa o if quando a senha esta correta e a situação diferente de 1 "ativo"
                if((correct) && (user.dataValues.situationId != 1) ){
                    return done(null, false, {message: "ERRO: Necessário confirmar o E-mail, solicite  novo link <a href='/conf-email'>clique aqui</a>!" });
                } else if(correct){ //acessa o else if quando a senha está correta
                    return done(null, user);
                }else{ //Acessa o ELSE quando a senha está incorreta
                    return done(null, false, {message: "ERRO: E-mail ou senha incorreta!"});
                }
            });
        });

        //Salvar os dados do usuario na sessão
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser(async (id, done) => {
            const user = await db.users.findByPk(id, {attributes: ['id', 'name', 'email', 'image']});
            done(null, user);
        });
    }));
}