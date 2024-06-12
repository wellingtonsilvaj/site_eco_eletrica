//incluir as bibliotecas
//gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');
//criptografar senha
const bcrypt = require('bcryptjs');
//utilizado para manipular as rotas da aplicação
const router = express.Router();
//incluir o arquivo que possui a conexão com o BD
const db = require('../db/models');
//Enviar e-mail
const nodemailer = require('nodemailer');


//Criar a rota para confirmar e-mail
router.get('/conf-email/:key', async (req, res) => {
    const { key } = req.params;

    //Reecuperar o registro do BD
   const user = await db.users.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id'],
        //Acrescentando condição para indicar qual registro deve ser retornado do BD
        where: {
            confEmail: key
        }
    });

    //Acessa o if se encontrar o registro no BD
    if (user) {
        //Editar registro no BD
        await db.users.update({
            confEmail: null,
            situationId:1
        }, {
            where: {
                id: user.id
            }
        })
        .then(() => {
        // Criar a mensagem de sucesso
        req.flash("success_msg", "E-mail ativado com sucesso!!");
        //Redirecionar usuário
        res.redirect('/login');
        }).catch(() => {
        // Criar a mensagem de erro
        req.flash("danger_msg", "ERRO: Link inválido, solicite novo link!!");
        //Redirecionar usuário
        res.redirect('/login');
        })

    } else {
        // Criar a mensagem de erro
        req.flash("danger_msg", "ERRO: Link inválido, solicite novo link!!");
        //Redirecionar usuário
        res.redirect('/login');
    }

});

//Criar a rota para página com formulario novo link confirma e-mail
router.get('/', (req, res) => {
    res.render("admin/login/new-conf-email", {layout: 'login'});
});

//Criar a rota para página para receber os dados do formulário novo link confirmar e-mail
router.post('/new-conf-email', async (req, res) => {

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
        //Gerar a chave para confirmar e-mail
        var confEmail = (await bcrypt.hash(data.email, 8)).replace(/\./g,"").replace(/\//g,"");

        //Editar o registro no BD
        await db.users.update({ confEmail }, {
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
            subject: "Confirma sua conta", //Título do e-mail
            text: "Prezado(a) " + user.name + "\n\nInformamos que a sua solicitação para confirmar o e-mail foi recebido com sucesso!\n\nPara que possamos liberar o seu cadastro em nosso sistema, solicitamos a confirmação do e-mail clicanco no link abaixo: " + process.env.URL_ADM +"/conf-email/conf-email/" + confEmail + " \n\nEsta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + " .<br>Você está recebendo porque está cadastrado no banco de dados da empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado pela empresa " + process.env.NAME_EMP + " tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.\n\n", // Conteúdo do e-mail somente texto
            html: "Prezado(a) " + user.name + "<br><br>Informamos que a sua solicitação para confirmar o e-mail foi recebido com sucesso!<br><br>Para que possamos liberar o seu cadastro em nosso sistema, solicitamos a confirmação do e-mail clicanco no link abaixo: <a href='" + process.env.URL_ADM + "/conf-email/conf-email/" + confEmail +"'>" + process.env.URL_ADM + "/conf-email/conf-email/" + confEmail + "</a> <br><br>Esta mensagem foi enviada a você pela empresa " + process.env.NAME_EMP + ".<br>Você está recebendo porque está cadastrado no banco de dados da empresa " + process.env.NAME_EMP + ". Nenhum e-mail enviado pela empresa " + process.env.NAME_EMP + " tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>", // Conteúdo do e-mail com HTML
          }
          //Enviar e-mail
          transport.sendMail(message_content, function (err) {
            if(err){
                //Pausar o processamento e carregar a view enviando os dados que o usuário havia preenchido no formulário
                res.render("admin/login/new-conf-email", {layout: 'login', data: req.body, warning_msg:"ERRO: Novo link não enviado, entre em contato com o suporte:!! " + process.env.EMAIL_ADM});

            } else {
                //Criar a mensagem de novo link confirmar e-mail enviado
                req.flash("success_msg", "Novo link enviado com sucesso. Acesse a sua caixa de e-mail para confirmar o e-mail");
                res.redirect('/login');
            }
          });

        }).catch(() =>{
             //Pausar o processamento e carregar a view enviando os dados que o usuárop havia preenchido no formulário
        res.render("admin/login/new-conf-email", {layout: 'login', data: req.body, danger_msg:"ERRO: Novo link não enviado, entre em contato com o suporte:!! " + process.env.EMAIL_ADM});
        });
    }else{
        //Pausar o processamento e carregar a view enviando os dados que o usuárop havia preenchido no formulário
        res.render("admin/login/new-conf-email", {layout: 'login', data: req.body, danger_msg:"ERRO: Nenhum usuário encontrado com esse e-mail!!"});
    }
});

//Criar a rota para página com formulário novo link recuperar senha
router.get('/recover-password', (req, res) => {
    res.render("admin/login/recover-password", {layout: 'login'});
 });


//exportar a instrução que está dentro da constante router
module.exports = router;