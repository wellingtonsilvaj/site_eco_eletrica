//incluir as bibliotecas
//gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');
//utilizado para manipular as rotas da aplicação
const router = express.Router();
//Arquvo com a funcionalidade para verificar se o usuário está logado
const {eAdmin} = require("../helpers/eAdmin");
const bcrypt = require('bcryptjs');
//Validar input do formulario
const yup = require('yup');
//Incluir o arquivo que possui a conexão com BD
const db = require('../db/models')

//criar rota do listar usuários, usar a função eAdmin com meddleware para verificar se o usuario está logado
router.get('/', eAdmin, async (req, res) => {
  //Receber o número da pagina, quando não é enviado o numero da pagina é atribuido a pagina 1
  const { page = 1 } = req.query;
  //Limite de registros em cada pagina
  const limit = 40;
  //variavel com o numero da ultima pagina
  var lastPage = 1;

  //Contar a quantidade de registro no BD
  const countContacts = await db.ContactsMsgs.count();

  //Acessa o IF quando encontrar o registro no BD
  if(countContacts !==0 ){
     //Calcular a ultima pagina
     lastPage = Math.ceil(countContacts / limit);
  }else{
     //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo, enviar msg de erro
     res.render("admin/contactsMsgs/list", {layout: 'main', profile:req.user.dataValues, sidebarContactsMsgs: true, danger_msg: 'ERRO: Nenhuma mensagem encontrada!'})
  }

   //Recuperar todos os usuarios do BD
   await db.ContactsMsgs.findAll({
    //Indicar quais colunas recuperar
    attributes: ['id', 'name','email', 'subject' ],
    //Ordenar os registros pela coluna id na fora decrescente
    order:[['id', 'DESC']],
    //Calcular a partir de qual registro deve retornar e o limite de registros
    offset: Number((page * limit) - limit),
    limit: limit
}).then((contacts) => {
    //Acessa o if quando retornar registro do BD
    if (contacts.length !==0) {
        //Criar objeto com as informações para paginação
        var pagination = {
            //caminho
            path: '/contacts-msgs',
            //pagina atual
            page,
            //URL da pagina anterior
            prev_page_url: ((Number(page) - Number(1)) >= 1) ? Number(page) - Number(1) : false,
            //URL da prox pagina
            next_page_url: ((Number(page) + Number(1)) > Number(lastPage)) ? false : Number(page) + Number(1),
            //Ultima pagina
            lastPage
        }
        //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo enviar os registros retornado no BD
        res.render("admin/contactsMsgs/list", {layout: 'main', profile:req.user.dataValues,  sidebarContactsMsgs: true, contacts: contacts.map(id => id.toJSON()), pagination})
    }else{
        //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo enviar mensagem de erro
        res.render("admin/contactsMsgs/list", {layout: 'main', profile:req.user.dataValues,  sidebarContactsMsgs: true, danger_msg: 'ERRO: Nenhuma mensagem encontrada!'})
    }
   
}).catch(() =>{
    //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo enviar mensagem de erro
    res.render("admin/contactsMsgs/list", {layout: 'main', profile:req.user.dataValues, sidebarContactsMsgs: true, danger_msg: 'ERRO: Nenhuma mensagem encontrada!'})
});

//Criar a rota para a pág visualizar os detalhes do registros
router.get('/view/:id', eAdmin, async (req, res) => {
    //Receber o id enviado na URL
    const {id} = req.params;

    //Recuperar o registro do BD
    const contactMsg = await db.ContactsMsgs.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id', 'name','email', 'subject', 'content', 'createdAt', 'updatedAt'],
        //Acrescentando condição para indicar qual registro deve ser retornado do BD
        where: {
            id 
        }
    });
 
   //Acessa o if se encontrar o registro no BD
   if(contactMsg){
    res.render("admin/contactsMsgs/view", {layout: 'main', profile:req.user.dataValues,  sidebarContactsMsgs: true, contactMsg});
}else{
    //Criar a mensagem de erro
    req.flash("danger_msg", "ERRO: Mensagens não encontrada!");
    //Redirecionar o usuário
    res.redirect('/contacts-msgs?page=1');
}

});

});
//exportar a instrução que está dentro da constante router
module.exports = router;