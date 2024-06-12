//incluir as bibliotecas
//gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');
//utilizado para manipular as rotas da aplicação
const router = express.Router();
//Arquvo com a funcionalidade para verificar se o usuário está logado
const {eAdmin} = require("../helpers/eAdmin");
//Incluir o arquivo que possui a conexão com BD
const db = require('./../db/models');

//criar rota pagina inicial
router.get('/', eAdmin, async (req, res) => {

    //contar a quantidade de registro no BD
    const countUser = await db.users.count();
    
    //Criar a variável para receber os dados
    var data = {countUser}

    res.render("admin/dashboard/dashboard", { layout: 'main',profile:req.user.dataValues, data, sidebarDashboard: true});
});

//exportar a instrução que está dentro da constante router
module.exports = router;