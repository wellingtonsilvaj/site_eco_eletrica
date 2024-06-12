//incluir as bibliotecas
//gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');
//criptografar senha
const bcrypt = require('bcryptjs');
//utilizado para manipular as rotas da aplicação
const router = express.Router();
//incluir o arquivo que possui a conexão com o BD
const db = require('../db/models');
//Validar input do formulario
const yup = require('yup');
//Enviar e-mail
const nodemailer = require('nodemailer');

//Criar a rota para página com formulário novo link recuperar senha
router.get('/', (req, res) => {
    res.render("admin/login/recover-password", {layout: 'login'});
 });

 

//Criar a rota com formulário recuperar senha
router.post('/recover-password', async (req, res) => {

    //Receber os dados do formulário
    var data = req.body;

    //Recuperar os registros do BD
    const user = await db.users.findOne({
        //Indicar quais colunas recuperar
        attributes:['id', 'name'],
        //Acrescentando condição para indicar qual registro deve ser retornado do BD
        where: {
            email: data.email
        }
    });
    //Acessa o if se encontrar o registro no BD
    if(user){
        //Gerar a chave para recuperar a senha
        var recoverPassword = (await bcrypt.hash(data.email, 8)).replace(/\./g,"").replace(/\//g,"");

        //Editar o registro no BD
        await db.users.update({ recoverPassword }, {
            where: { id: user.id }
        }).then(() =>{

            var transport = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS
                }
            });

            
          // Criar a variável com o conteúdo do e-mail
          var message_content = {
            from: process.env.EMAIL_PASS, //Rementent
            to: data.email, //E-mail do destinatario
            subject: "Recuperar senha", //Título do e-mail
            text: "Prezado(a) " + user.name + "\n\nInformamos que a sua solicitação de alteração de senha foi recebida com sucesso!\n\nClique no link abaixo para criar uma nova senha em nosso sistema: " + process.env.URL_ADM +"/recover-password/update-password/" + recoverPassword + " \n\nEsta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + " .<br>Você está recebendo porque está cadastrado no banco de dados da empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado pela empresa " + process.env.NAME_EMP + " tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.\n\n", // Conteúdo do e-mail somente texto
            html: "Prezado(a) " + user.name + "<br><br>Informamos que a sua solicitação de alteração de senha foi recebida com sucesso!<br><br>Clique no link abaixo para criar uma nova senha em nosso sistema: <a href='" + process.env.URL_ADM + "/recover-password/update-password/" + recoverPassword +"'>" + process.env.URL_ADM + "/recover-password/update-password/" + recoverPassword + "</a> <br><br>Esta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + ".<br>Você está recebendo porque está cadastrado no banco de dados da empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado pela empresa " + process.env.NAME_EMP + " tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>", // Conteúdo do e-mail com HTML
          }
          //Enviar e-mail
          transport.sendMail(message_content, function (err) {
            if(err){
                //Pausar o processamento e carregar a view enviando os dados que o usuário havia preenchido no formulário
                res.render("admin/login/recover-password", {layout: 'login', data: req.body, warning_msg:"ERRO: E-mail com as instruções para recuperar a senha não enviado, tente novamente ou entre em contato com o e-mail: " + process.env.EMAIL_ADM});

            } else {
                //Criar a mensagem de novo link recuperar senha
                req.flash("success_msg", "Enviado e-mail com instruções para recuperar a senha. Acesse a sua caixa de e-mail para recuperar a senha!");
                res.redirect('/login');
            }
          });

        }).catch(() =>{
             //Pausar o processamento e carregar a view enviando os dados que o usuário havia preenchido no formulário
        res.render("admin/login/recover-password", {layout: 'login', data: req.body, danger_msg:"ERRO: Novo link não enviado, entre em contato com o suporte:!! " + process.env.EMAIL_ADM});
        });
    }else{
        //Pausar o processamento e carregar a view enviando os dados que o usuárop havia preenchido no formulário
        res.render("admin/login/recover-password", {layout: 'login', data: req.body, danger_msg:"ERRO: Nenhum usuário encontrado com esse e-mail!!"});
    }
});


//Criar a rota para pagina com formulario atualizar senha
router.get('/update-password/:key', async (req, res) => {
    const { key } = req.params;

    //Reecuperar o registro do BD
   const user = await db.users.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id'],
        //Acrescentando condição para indicar qual registro deve ser retornado do BD
        where: {
            recoverPassword: key
        }
    });

    //Acessa o if se encontrar o registro no BD
    if (user) {
        res.render("admin/login/update-password", {layout: 'login', data: {id: user.id, key}});
    } else {
        // Criar a mensagem de erro
        req.flash("danger_msg", "ERRO: Link inválido, solicite novo link <a href='/recover-password'>clique aqui</a>!");
        //Redirecionar usuário
        res.redirect('/login');
    }

});


//Criar a rota para cadastrar o formulario atualizar senha
router.post('/update-password', async (req, res) => {
    //Receber dados do formulario
     var data = req.body;
 
     const schema = yup.object().shape({

         key: yup.string("Erro: Necessário solicitar novo link para atualizar a senha, solicite novo link <a href='/recover-password'>clique aqui</a>! ")
             .required("Erro: Necessário solicitar novo link para atualizar a senha,  solicite novo link <a href='/recover-password'>clique aqui</a>! "),
         id: yup.string("Erro: Necessário solicitar novo link para atualizar a senha, solicite novo link <a href='/recover-password'>clique aqui</a>! ")
             .required("Erro: Necessário solicitar novo link para atualizar a senha,  solicite novo link <a href='/recover-password'>clique aqui</a>! "),
         password: yup.string("Erro: Necessário preencher o campo senha!")
             .required("Erro: Necessário preencher o campo senha!")
             .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
     });
     // Verificar se todos os campos passaram pela validação
     try {
         await schema.validate(data);
     } catch (error) {
        //Pausar o processamento e carregar a view enviando os dados que o usuário havia preenchido no formulário
        return res.render("admin/login/update-password", {layout: 'login.handlebars', data, danger_msg: error.errors});
     }
     //Recuperar os registros do BD
    const user = await db.users.findOne({
        //Indicar quais colunas recuperar
        attributes:['id', 'email'],
        //Acrescentando condição para indicar qual registro deve ser retornado do BD
        where: {
            recoverPassword: data.key
        }
    });
    //Acessa o if se encontrar o registro no BD
    if(user){
        
        //Criptografar a senha
        var password = await bcrypt.hash(data.password, 8);

        //Editar o registro no BD
        await db.users.update({recoverPassword: null, password}, {
            where: {id: user.id}
        }).then(() =>{
            // Criar a mensagem de sucesso
            req.flash('success_msg', 'Senha editada com sucesso!')
            //Redirecionar usuário
            res.redirect('/login');
        }).catch(() => {

            //Pausar o processamento e carregar a view enviando os dados que o usuário havia preenchido no formulário
            return res.render("admin/login/update-password", {layout: 'login.handlebars', data, danger_msg: "ERRO: Senha não editada com sucesso!" });
        });

    }else{
        //Pausar o processamento e carregar a view enviando os dados que o usuário havia preenchido no formulário
        return res.render("admin/login/update-password", {layout: 'login.handlebars', data, danger_msg: "Erro: Necessário solicitar novo link para atualizar a senha,  solicite novo link <a href='/recover-password'>clique aqui</a>! "});

    }
    }); 

//exportar a instrução que está dentro da constante router
module.exports = router;