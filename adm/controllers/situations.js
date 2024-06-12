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
    const countSituation = await db.situations.count();

    //Acessa o IF quando encontrar o registro no BD
    if(countSituation !==0 ){
        //Calcular a ultima pagina
        lastPage = Math.ceil(countSituation / limit);
    }else{
        //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo, enviar msg de erro
        res.render("admin/situations/list", {layout: 'main', profile:req.user.dataValues, sidebarSituations: true, danger_msg: 'ERRO: Nenhuma situação encontrada!'})
    }

    //Recuperar todos os usuarios do BD
    await db.situations.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id', 'nameSituation'],
        //Ordenar os registros pela coluna id na fora decrescente
        order:[['id', 'DESC']],
        //Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    }).then((situations) => {
        //Acessa o if quando retornar registro do BD
        if (situations.length !==0) {
            //Criar objeto com as informações para paginação
            var pagination = {
                //caminho
                path: '/situations',
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
            res.render("admin/situations/list", {layout: 'main', profile:req.user.dataValues,  sidebarSituations: true, situations: situations.map(id => id.toJSON()), pagination})
        }else{
            //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo enviar mensagem de erro
            res.render("admin/situations/list", {layout: 'main', profile:req.user.dataValues,  sidebarSituations: true, danger_msg: 'ERRO: Nenhuma situação encontrada!'})
        }
       
    }).catch(() =>{
        //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo enviar mensagem de erro
        res.render("admin/situations/list", {layout: 'main', profile:req.user.dataValues, sidebarSituations: true, danger_msg: 'ERRO: Nenhuma situação encontrada!'})
    })
});

//Criar a rota para a pág visualizar os detalhes do registros
router.get('/view/:id', eAdmin, async (req, res) => {
    //Receber o id enviado na URL
    const {id} = req.params;

    //Recuperar o registro do BD
    const situation = await db.situations.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id', 'nameSituation', 'createdAt', 'updatedAt'],
        //Acrescentando condição para indicar qual registro deve ser retornado do BD
        where: {
            id 
        }
    });
   //Acessa o if se encontrar o registro no BD
   if(situation){
        res.render("admin/situations/view", {layout: 'main', profile:req.user.dataValues,  profile:req.user.dataValues,  sidebarSituations: true, situation});
   }else{
        //Criar a mensagem de erro
        req.flash("danger_msg", "ERRO: Usuário não encontrado!");
        //Redirecionar o usuário
        res.redirect('/situations');
   }
});

router.get('/add', eAdmin, (req, res) =>{

    res.render("admin/situations/add", {layout: 'main',profile:req.user.dataValues,  sidebarSituations: true } )
});

router.post('/add', eAdmin, async (req, res) =>{

    //Receber dados do formulario
    var data = req.body;

    const schema = yup.object().shape({
        nameSituation: yup.string("Erro: Necessário preencher o campo nome da situação!")
             .required("Erro: Necessário preencher o campo nome da situação!"),
        nameSituation: yup.string("Erro: Necessário preencher o campo nome da situaçãp!")
             .required("Erro: Necessário preencher o campo nome da situação!")
             .min(4, "Erro: O campo nome da situação deve ter no mínimo 4 caracteres!"),
    });
    
     // Verificar se todos os campos passaram pela validação
     try {
        await schema.validate(data);
    } catch (error) {
       //Pausa o processamento e carrega a view enviando os dados que o usuario havia preenchido no formulário
        return res.render("admin/situations/add", {layout: 'main', profile:req.user.dataValues,  sidebarSituations: true, data, danger_msg: error.errors});
    }
    
     //Recuperar o registro do banco de dados
 
     const situation = await db.situations.findOne({
        //indicar quais colunas recuperar
        attributes: ['id', 'nameSituation'],
        where: {
            nameSituation: data.nameSituation
        }
    });

    if(situation){
        //Pausar processamento e carregar view enviando os dados que o usuario havia 
        //preenchido no formulario
        return res.render("admin/situations/add", {layout: 'main', profile:req.user.dataValues,   sidebarSituations: true, data, danger_msg: "ERRO:Está situação já foi cadastrada"});
    }
    //Cadastrar no BD
    db.situations.create(data).then((dataSituation) => {
        
        //Criar a mensagem de situação cadastrada
        req.flash("success_msg", "Situação cadastrada com sucesso!");
        //res.redirect('/situations?page=1');
        res.redirect('/situations/view/' + dataSituation.id);
    }).catch(() => {
        //Pausar processamento e carregar view enviando os dados que o usuario havia 
        //preenchido no formulario
        return res.render("admin/situations/add", {layout: 'main', profile:req.user.dataValues,  data: req.body, danger_msg: "ERRO: Situação não cadastrada com sucesso!"});
     });
});

//Criar a rota para pág com formulário edit usuário
router.get('/edit/:id', eAdmin, async (req, res) => {
    
    //Receber o id enviado na URL
    const { id } = req.params;
    
    //Recuperar o registro do BD
    const situation = await db.situations.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id', 'nameSituation'],
        //Acrescentando condição para indicar qual registro deve ser retornado do BD
        where: {
            id 
        }
    });
    
   //Acessa o if se encontrar o registro no BD
   if(situation){
     //Enviar dados para o formulário
     var dataForm = situation.dataValues;
     //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
     res.render('admin/situations/edit', { layout: 'main', profile:req.user.dataValues,  data: dataForm, sidebarSituations: true});
}else{
    //Criar a mensagem de erro
    req.flash("danger_msg", "ERRO: Situação não encontrada!");
    //Redirecionar o usuário
    res.redirect('/situations');
}
});

//Criar a rota para receber os dados do formulário editar situação
router.post('/edit', eAdmin, async (req, res) =>{
    //Receber dados do formulário
    var data = req.body;
   
    //Inicio enviar dados para formulario
    //Enviar dados para o formulário
    var dataForm = req.body;

    //Validar se o usuario preencheu todos os campos
    const schema = yup.object().shape({
        nameSituation: yup.string("Erro: Necessário preencher o campo nome da situação!")
            .required("Erro: Necessário preencher o campo nome da situação!"),
        nameSituation: yup.string("Erro: Necessário preencher o campo nome da situação!")
            .required("Erro: Necessário preencher o campo nome da situação!")
            .min(4, "Erro: O campo nome da situação deve ter no mínimo 4 caracteres!"),

    });
     // Verificar se todos os campos passaram pela validação
     try {
        await schema.validate(data);
    } catch (error) {
       //Pausa o processamento e carrega a view enviando os dados que o usuario havua preenchido no formulário
        return res.render("admin/situations/edit", {layout: 'main', profile:req.user.dataValues, sidebarSituations: true, data: dataForm, danger_msg: error.errors});
    }
        const situation = await db.situations.findOne({
            //indicar quais colunas recuperar
            attributes: ['id', 'nameSituation'],
            where: {
                nameSituation: data.nameSituation,
        }
    });
    if(situation){
        //Pausar processamento e carregar view enviando os dados que o usuario havia 
        //preenchido no formulario
        return res.render("admin/situations/edit", {layout: 'main', profile:req.user.dataValues,   sidebarSituations: true, data: dataForm, danger_msg: "ERRO: Esta situação já foi cadastrada"});
    }

    //Editar no BD
    db.situations.update(data, { where: { id: data.id} }).then(() =>{
        //Criar a mensagem de usuario editado com sucesso
        req.flash("success_msg", "situação editado com sucesso!");
        //Redirecionar o usuario apos editar
        //res.redirect('/users?page=1');
        //Redirecionar o usuario apos editar para a pagina visualizar
        res.redirect('/situations/view/' + data.id);
        
    }).catch(() =>{
        
        //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
        res.render('admin/situations/edit', { layout: 'main', profile:req.user.dataValues,  data: dataForm, sidebarSituations: true});
    });

});

//Criar a rota apagar usuário no BD, usar a função eAdmin com middleware para verificar se o usuario esta logado
router.get('/delete/:id', async (req, res) => {
    //Recuperar o registro no BD para verificar se a situação está sendo utilizada por algum usuário
    const user = await db.users.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id'],
        //Acrescentar condição para indicar qual registro deve ser retornado do BD
        where: {
            situationId: req.params.id
        }
    });

//Acessa o ID se encontrar o registro no BD
if (user) {
    //Criar a mensagem de situação não apagada
    req.flash("danger_msg", "A situação não pode ser apagada, há usuário utilizando essa situação!");
    
    //Redirecionar o usuario após não apagar
    return res.redirect('/situations/view/' + req.params.id);
}

 //Apagar usuário no BD utilizando a MODELS users
 db.situations.destroy({
    //acrescentar o WHERE na instrução SQL indicando qual registro excluir no BD
    where:{
        id: req.params.id
    }

}).then(() =>{
    //Criar a mensagem de situação apagado com sucesso
    req.flash("success_msg", "Situação apagada com sucesso!");

    //Redirecionar a situação após apagar com sucesso
    res.redirect('/situations?page=1');
}).catch(() =>{
    //Criar a mensagem de situação não apagado
    req.flash("danger_msg", "Situação não apagado com sucesso!");

    //Redirecionar a situação após não apagar
    //res.redirect('/users?page=1');
    res.redirect('/situations/view/' + req.params.id);
});
});
//exportar a instrução que está dentro da constante router
module.exports = router;