//incluir as bibliotecas
//gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');
//utilizado para manipular as rotas da aplicação
const router = express.Router();
//Arquvo com a funcionalidade para verificar se o usuário está logado
const { eAdmin } = require("../helpers/eAdmin");
//Validar input do formulario
const yup = require('yup');
//Incluir o arquivo que possui a conexão com BD
const db = require('../db/models');
//Operador do sequelize
const{Op} = require("sequelize");
//Incluir o arquivo com função de upload
const upload = require('../helpers/uploadImgHomePrem');
const uploadImgTop = require('../helpers/uploadImgHomeTop');
//O módulo fs permite interagir com o sistema de arquivos
const fs = require('fs');

//criar rota do listar usuários, usar a função eAdmin com meddleware para verificar se o usuario está logado
router.get('/', eAdmin, async (req, res) => {

      
    //Recuperar registros do BD Tabela HomesTops
    const homeTop = await db.HomesTops.findOne({
        //Indicar quais colunas recuperar           
        attributes: ['titleOneTop', 'titleTwoTop', 'titleThreeTop', 'linkBtnTop', 'txtBtnTop', 'imageTop', 'createdAt', 'updatedAt']
    });


    //Recuperar registros do BD tabela HomesServices
    const homeService = await db.HomesServices.findOne({
        //Indicar quais colunas recuperar
        attributes:['titleService', 'iconOne', 'iconTwo', 'iconThree', 'titleOneService', 'titleTwoService', 'titleThreeService', 'descOneService', 'descTwoService', 'descThreeService', 'createdAt', 'updatedAt']

    });

    //Recuperar registros do BD tabela HomesPremiums
    const homePremium = await db.HomesPremiums.findOne({
        //Indicar quais colunas recuperar
        attributes:['premTitle', 'premSubtitle', 'premDesc', 'premBtn_text', 'premBtn_link', 'premImage', 'createdAt', 'updatedAt']
    });


    //Acessa o IF se encontrar o registro no BD
    if(homeTop){
        res.render("admin/siteHome/view", { layout: 'main', profile: req.user.dataValues, sidebarHomeSite: true, homeTop, homeService, homePremium});
    }else{
        //Criar mensagem de erro
        req.flash("danger_msg", "ERRO: Não encontramos o conteúdo Topo do site");
        res.redirect('/dashboard');
    }

});

//Criar a rota para pág com formulário editar conteudo do topo da pagina home
router.get('/edit-top', eAdmin, async (req, res) => {

    //Recuperar o registro do BD
   const homeTop = await db.HomesTops.findOne({
    //Indicar quais colunas recuperar
    attributes: ['id', 'titleOneTop', 'titleTwoTop', 'titleThreeTop','linkBtnTop','txtBtnTop'],
    
});
    //Acessa o IF se encontrar o registro no bd
    if (homeTop) {
        //Enviar dados para o formulário
        var dataForm = homeTop.dataValues;


    //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
    res.render('admin/siteHome/edit-top', { layout: 'main',profile:req.user.dataValues,  data: dataForm, sidebarHomeSite: true});
    } else {
    //Criar mensagem de erro
    req.flash("danger_msg", "ERRO: Não encontrado conteúdo do topo da página home do site!");
    //Redirecionar user
    res.redirect('/dashboard');
    }   
}); 

//Criar a rota para pág com formulário editar conteudo do topo da pagina home
router.post('/edit-top', eAdmin, async (req, res) =>{

    //Receber dados do formulário
    var data = req.body;
   
    //Inicio enviar dados para formulario
    //Enviar dados para o formulário
    var dataForm = req.body;

     
    //Validar se o usuario preencheu todos os campos
    const schema = yup.object().shape({
        id:yup.string("Erro: Preenchimento incorreto do formulário!")
            .required("Erro:Preenchimento incorreto do formulário!"),
        txtBtnTop: yup.string("Erro: Necessário preencher o campo Texto do botão!")
            .required("Erro: Necessário preencher o campo texto do botão!"),
        linkBtnTop: yup.string("Erro: Necessário preencher o campo link do botão!")
            .required("Erro: Necessário preencher o campo link do botão!"),
        titleThreeTop: yup.string("Erro: Necessário preencher o campo título três!")
            .required("Erro: Necessário preencher o campo título três!"),
        titleTwoTop: yup.string("Erro: Necessário preencher o campo título dois!")
            .required("Erro: Necessário preencher o campo título dois!"),
        titleOneTop: yup.string("Erro: Necessário preencher o campo título um!")
            .required("Erro: Necessário preencher o campo título um!")
        });
        // Verificar se todos os campos passaram pela validação
        try {
            await schema.validate(data);
        } catch (error) {
        //Pausa o processamento e carrega a view enviando os dados que o usuario havua preenchido no formulário
            return res.render("admin/siteHome/edit-top", {layout: 'main',profile:req.user.dataValues,  sidebarHomeSite: true, data: dataForm, danger_msg: error.errors});
        
        }

        
    //Editar no BD
    db.HomesTops.update(data, { where: { id: data.id} }).then(() =>{
        //Criar a mensagem de usuario editado com sucesso
        req.flash("success_msg", "Contéudo do topo da pagina Home editado com sucesso!");
        
        //Redirecionar o usuario apos editar
        res.redirect('/home-site');
        
    }).catch(() =>{
        
        //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
        return res.render('admin/siteHome/edit-top', { layout: 'main', profile:req.user.dataValues, data: dataForm, sidebarHomeSite: true, danger_msg:"ERRO: Contéudo do topo da pagina Home NÃO editado com sucesso!"});
    });

});
//Criar a rota para pág com formulário editar conteudo do topo da pagina home
router.get('/edit-serv', eAdmin, async (req, res) => {

    //Recuperar o registro do BD
    const homeService = await db.HomesServices.findOne({
    //Indicar quais colunas recuperar
    attributes: ['id', 'titleService', 'iconOne', 'iconTwo','iconThree','titleOneService','titleTwoService','titleThreeService','descOneService','descTwoService','descThreeService'],
    
    });
    //Acessa o IF se encontrar o registro no bd
    if (homeService) {
        //Enviar dados para o formulário
        var dataForm = homeService.dataValues;


    //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
    res.render('admin/siteHome/edit-serv', { layout: 'main', profile:req.user.dataValues,  data: dataForm, sidebarHomeSite: true});
    } else {
    //Criar mensagem de erro
    req.flash("danger_msg", "ERRO: Não encontrado conteúdo do topo da página home serviço!");
    //Redirecionar user
    res.redirect('/dashboard');
    }   
}); 

//Criar a rota para receber os dados do formulário editar usuario
router.post('/edit-serv', eAdmin, async (req, res) =>{

      //Receber dados do formulário
      var data = req.body;
   
      //Inicio enviar dados para formulario
      //Enviar dados para o formulário
      var dataForm = req.body;
  
//Validar se o usuario preencheu todos os campos
const schema = yup.object().shape({
    id:yup.string("Erro: Preenchimento incorreto do formulário!")
        .required("Erro:Preenchimento incorreto do formulário!"),
    descThreeService: yup.string("Erro: Necessário preencher o campo descrição três do serviço!")
        .required("Erro: Necessário preencher o campo descrição três do serviço!"),
    descTwoService: yup.string("Erro: Necessário preencher o campo descrição dois do serviço!")
        .required("Erro: Necessário preencher o campo descrição dois do serviço"),
    descOneService: yup.string("Erro: Necessário preencher o campo descrição um do serviço!")
        .required("Erro: Necessário preencher o campo descrição um do serviço!"),
    titleThreeService: yup.string("Erro: Necessário preencher o campo título três do serviço!")
        .required("Erro: Necessário preencher o campo título três do serviço!"),
    titleTwoService: yup.string("Erro: Necessário preencher o campo título dois do serviço!")
        .required("Erro: Necessário preencher o campo  dois do serviço!"),
    titleOneService: yup.string("Erro: Necessário preencher o campo título um do serviço!")
        .required("Erro: Necessário preencher o campo título um do serviço!!"),
    titleTwoService: yup.string("Erro: Necessário preencher o campo título um do serviço!")
        .required("Erro: Necessário preencher o campo  dois do serviço!"),
    iconThree: yup.string("Erro: Necessário preencher o campo ícone três!")
        .required("Erro: Necessário preencher o campo ícone três!"),
    iconTwo: yup.string("Erro: Necessário preencher o campo ícone dois!")
        .required("Erro: Necessário preencher o campo ícone dois!"),
    iconOne: yup.string("Erro: Necessário preencher o campo ícone um!")
        .required("Erro: Necessário preencher o campo  ícone um!"),
    titleService: yup.string("Erro: Necessário preencher o campo título do serviço!")
        .required("Erro: Necessário preencher o campo  título do serviço!")
    });
    // Verificar se todos os campos passaram pela validação
    try {
        await schema.validate(data);
    } catch (error) {
    //Pausa o processamento e carrega a view enviando os dados que o usuario havua preenchido no formulário
        return res.render("admin/siteHome/edit-serv", {layout: 'main',profile:req.user.dataValues,  sidebarHomeSite: true, data: dataForm, danger_msg: error.errors});
    
    }
    //Editar no BD
    db.HomesServices.update(data, { where: { id: data.id} }).then(() =>{
        //Criar a mensagem de usuario editado com sucesso
        req.flash("success_msg", "Contéudo dos Serviços da página Home editado com sucesso!");
        
        //Redirecionar o usuario apos editar
        res.redirect('/home-site');
        
    }).catch(() =>{
        
        //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
        return res.render('admin/siteHome/edit-serv', { layout: 'main', profile:req.user.dataValues, data: dataForm, sidebarHomeSite: true, danger_msg:"ERRO: Contéudo do serviços Home NÃO editado com sucesso!"});
    });
});

//Criar a rota para pág com formulário editar conteudo do topo da pagina home
router.get('/edit-prem', eAdmin, async (req, res) => {
   
    //Recuperar o registro do BD
    const homePremium = await db.HomesPremiums.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id', 'premTitle', 'premSubtitle', 'premDesc','premBtn_text','premBtn_link','premImage'],
        
    });
 //Acessa o IF se encontrar o registro no bd
 if (homePremium) {
    //Enviar dados para o formulário
    var dataForm = homePremium.dataValues;


    //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
    res.render('admin/siteHome/edit-prem', { layout: 'main', profile:req.user.dataValues,  data: dataForm, sidebarHomeSite: true}); 
}else{
    //Criar mensagem de erro
    req.flash("danger_msg", "ERRO: Não encontrado conteúdo do topo da página home premium!");
    //Redirecionar user
    res.redirect('/dashboard');
}   
}); 


//Criar a rota para receber os dados do formulário editar usuario
router.post('/edit-prem', eAdmin, async (req, res) =>{

    
      //Receber dados do formulário
      var data = req.body;
   
      //Inicio enviar dados para formulario
      //Enviar dados para o formulário
      var dataForm = req.body;

        
    //Validar se o usuario preencheu todos os campos
    const schema = yup.object().shape({
        id:yup.string("Erro: Preenchimento incorreto do formulário!")
            .required("Erro:Preenchimento incorreto do formulário!"),
        premImage: yup.string("Erro: Necessário preencher o campo título da imagem!")
            .required("Erro: Necessário preencher o campo título da imagem!"),
        premBtn_link: yup.string("Erro: Necessário preencher o campo link do botão!")
            .required("Erro: Necessário preencher o campo link do botão!"),
        premBtn_text: yup.string("Erro: Necessário preencher o campo texto do botão")
            .required("Erro: Necessário preencher o campo texto do botão!"),
        premDesc: yup.string("Erro: Necessário preencher o campo descrição!")
            .required("Erro: Necessário preencher o campo descrição!"),
        premSubtitle: yup.string("Erro: Necessário preencher o campo subtítulo!")
            .required("Erro: Necessário preencher o campo subtítulo!"),
        premTitle: yup.string("Erro: Necessário preencher o campo título!")
            .required("Erro: Necessário preencher o campo título!")
        });
        // Verificar se todos os campos passaram pela validação
        try {
            await schema.validate(data);
        } catch (error) {
        //Pausa o processamento e carrega a view enviando os dados que o usuario havua preenchido no formulário
            return res.render("admin/siteHome/edit-prem", {layout: 'main',profile:req.user.dataValues,  sidebarHomeSite: true, data: dataForm, danger_msg: error.errors});
        
        }

        //Editar no BD
    db.HomesPremiums.update(data, { where: { id: data.id} }).then(() =>{
        //Criar a mensagem de usuario editado com sucesso
        req.flash("success_msg", "Contéudo dos Serviços Premiums da página Home editado com sucesso!");
        
        //Redirecionar o usuário após editar
        res.redirect('/home-site');
        
    }).catch(() =>{
        
        //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
        return res.render('admin/siteHome/edit-prem', { layout: 'main', profile:req.user.dataValues, data: dataForm, sidebarHomeSite: true, danger_msg:"ERRO: Contéudo do serviços Premiums Home NÃO editado com sucesso!"});
    });

});


//Criar a rota editar a imagem do topo no BD, usar a função eAdmin com middleware para verificar se o usuario esta logado
router.get('/edit-top-image', eAdmin, async (req, res) => {

 //Recuperar o registro do BD
 const homeTop = await db.HomesTops.findOne({
    //Indicar quais colunas recuperar
    attributes: ['id', [ 'imageTop', 'imageOld']],

});
 //Acessa o IF se encontarar o  registro no BD
 if (homeTop) {
    //Enviar dados para o formulario
    var dataForm = homeTop.dataValues;

    //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
    res.render('admin/siteHome/edit-top-image', {layout: 'main',profile:req.user.dataValues, data: dataForm, sidebarHomeSite: true});
}else{
    // Criar a mensagem de erro
    req.flash("danger_msg", "Erro: imagem não encontrada!");
    // Redirecionar o usuário
    res.redirect('/dashboard');
}

});

//Criar a rota receber a imagem usuário editar imagem do topo,usar a função eAdmin com middleware para verificar se o usuario esta logado
router.post('/edit-top-image', eAdmin, uploadImgTop.single('imageTop'), async (req, res) => {
    //Receber os dados do fornulario
    var data = req.body;

    //Enviar dados para o formulário
    var dataForm = req.body;

    //Acessa a extenção quando a imagem for invalida
    if (!req.file) {
        //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo
        return res.render('admin/siteHome/edit-top-image', { layout: 'main', profile: req.user.dataValues, data: dataForm, sidebarHomeSite: true, danger_msg: "Erro: Selecione uma imagem valida JPEG ou PNG"});
    }
     //Recuperar o registro do BD
     const homeTop = await db.HomesTops.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id', 'imageTop'],

        //Acrescentar condição para indicar qual registro deve ser retornado do BD
        where: {
            id: data.id
        }

    });

     //Verificar se tem imagem salva no BD
     if(homeTop.dataValues.imageTop){
        //Criar o caminho da imagem que tem no BD
        var imgOld = "./public/images/home_top/" + homeTop.dataValues.imageTop;

        //fs.access usado para testar as permissões do arquivo
        fs.access(imgOld, (err) => {
            //Acessa o IF quando não tiver nenhum erro
            if (!err) {
                //Apagar imagem antiga
                fs.unlink(imgOld, () => { })
            }
        });

    }
        //Editar no BD
        db.HomesTops.update({ imageTop: req.file.filename}, {where: {id: data.id}}).then(() =>{
            //Criar a mensagem de imagem do usuario editada com sucesso
            req.flash("success_msg", "Imagem editada com sucesso!");

            //Redirecionar o usuario apos editar para a pagina visualizar
            res.redirect('/home-site');
        }).catch(() =>{ 
            // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
            res.render('admin/siteHome/edit-top-image', { layout: 'main', profile:req.user.dataValues, data: dataForm, sidebarHomeSite: true, danger_msg: "ERRO: Imagem não editada com sucesso! " });
        });
});

//Criar a rota editar a imagem premium no BD, usar a função eAdmin com middleware para verificar se o usuario esta logado
router.get('/edit-prem-image', eAdmin, async (req, res) => {

    //Recuperar o registro do BD
    const homePremium = await db.HomesPremiums.findOne({
    //Indicar quais colunas recuperar
    attributes: ['id', [ 'premImage', 'imageOld']],

});

    //Acessa o IF se encontarar o  registro no BD
    if (homePremium) {
        //Enviar dados para o formulario
        var dataForm = homePremium.dataValues;

        //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
        res.render('admin/siteHome/edit-prem-image', {layout: 'main',profile:req.user.dataValues, data: dataForm, sidebarHomeSite: true});
    }else{
        // Criar a mensagem de erro
        req.flash("danger_msg", "Erro: imagem não encontrada!");
        // Redirecionar o usuário
        res.redirect('/dashboard');
    }
});

//Criar a rota receber a imagem usuário editar imagem premium,usar a função eAdmin com middleware para verificar se o usuario esta logado
router.post('/edit-prem-image', eAdmin, upload.single('premImage'), async (req, res) => {
    //Receber os dados do fornulario
    var data = req.body;

    //Enviar dados para o formulário
    var dataForm = req.body;

     //Acessa a extenção quando a imagem for invalida
     if (!req.file) {
        //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo
        return res.render('admin/siteHome/edit-prem-image', { layout: 'main', profile: req.user.dataValues, data: dataForm, sidebarHomeSite: true, danger_msg: "Erro: Selecione uma imagem valida JPEG ou PNG"});
    }

    //Recuperar o registro do BD
    const homePremium = await db.HomesPremiums.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id', 'premImage'],

        //Acrescentar condição para indicar qual registro deve ser retornado do BD
        where: {
            id: data.id
        }

});

    //Verificar se tem imagem salva no BD
    if(homePremium.dataValues.premImage) {
        //Criar o caminho da imagem que tem no BD
        var imgOld = "./public/images/home_prem/" + homePremium.dataValues.premImage;

        //fs.access usado para testar as permissões do arquivo
        fs.access(imgOld, (err) => {
            //Acessa o IF quando não tiver nenhum erro
            if (!err) {
                //Apagar imagem antiga
                fs.unlink(imgOld, () => { })
            }
        });

    }

    //Editar no BD
    db.HomesPremiums.update({ premImage: req.file.filename}, {where: {id: data.id}}).then(() =>{
        //Criar a mensagem de imagem do usuario editada com sucesso
        req.flash("success_msg", "Imagem editada com sucesso!");

        //Redirecionar o usuario apos editar para a pagina visualizar
        res.redirect('/home-site');
    }).catch(() =>{ 
        // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
        res.render('admin/siteHome/edit-prem-image', { layout: 'main', profile:req.user.dataValues, data: dataForm, sidebarHomeSite: true, danger_msg: "ERRO: Imagem não editada com sucesso! " });
    });
});

//exportar a instrução que está dentro da constante router
module.exports = router;