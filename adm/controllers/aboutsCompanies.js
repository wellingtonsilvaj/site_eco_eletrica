//incluir as bibliotecas
//gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');
//utilizado para manipular as rotas da aplicação
const router = express.Router();
//Arquvo com a funcionalidade para verificar se o usuário está logado
const {eAdmin} = require("../helpers/eAdmin");
//Validar input do formulario
const yup = require('yup');
//Incluir o arquivo que possui a conexão com BD
const db = require('../db/models');
//Operador do sequelize
const{Op} = require("sequelize");
//Incluir o arquivo com função de upload
const upload = require('../helpers/uploadImgAbout');
//O módulo fs permite interagir com o sistema de arquivos
const fs = require('fs');

//criar rota do listar usuários, usar a função eAdmin com meddleware para verificar se o usuario está logado
router.get('/', eAdmin, async (req, res) => {

         //Receber o número da pagina, quando não é enviado o numero da pagina é atribuido a pagina 1
         const { page = 1 } = req.query;
         //Limite de registros em cada pagina
         const limit = 40;
         //variavel com o numero da ultima pagina
         var lastPage = 1;
     
         //Contar a quantidade de registro no BD
         const countAboutsCompanies = await db.AboutsCompanies.count();
     
         //Acessa o IF quando encontrar o registro no BD
         if(countAboutsCompanies !==0 ){
            //Calcular a ultima pagina
            lastPage = Math.ceil(countAboutsCompanies / limit);
         }else{
            //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo, enviar msg de erro
            res.render("admin/aboutsCompanies/list", {layout: 'main', profile:req.user.dataValues, sidebarAboutsSite: true, danger_msg: 'ERRO: Nenhuma sobre encontrada!'})
         }
    

     //Recuperar todos os usuarios do BD
     await db.AboutsCompanies.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id', 'titleAboutsCompanies'],
        //Ordenar os registros pela coluna id na fora decrescente
        // Buscar dados na tabela secundária
        include: [{
            model: db.SituationsAbouts,
            attributes: ['nameSituation']
        }],
        order:[['id', 'DESC']],
        //Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    }).then((aboutsCompanies) => {
        //Acessa o if quando retornar registro do BD
        if (aboutsCompanies.length !==0) {
            //Criar objeto com as informações para paginação
            var pagination = {
                //caminho
                path: '/abouts-companies-site',
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
            res.render("admin/aboutsCompanies/list", {layout: 'main', profile:req.user.dataValues,  sidebarAboutsSite: true, aboutsCompanies: aboutsCompanies.map(id => id.toJSON()), pagination})
        }else{
            //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo enviar mensagem de erro
            res.render("admin/aboutsCompanies/list", {layout: 'main', profile:req.user.dataValues,  sidebarAboutsSite: true, danger_msg: 'ERRO: Nenhuma sobre encontrada!'})
        }
       
    }).catch(() =>{
        //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo enviar mensagem de erro
        res.render("admin/aboutsCompanies/list", {layout: 'main', profile:req.user.dataValues, sidebarAboutsSite: true, danger_msg: 'ERRO: Nenhuma sobre encontrada!'})
    })
});

    
//Criar a rota para a pág visualizar os detalhes do registros
router.get('/view/:id', eAdmin, async (req, res) => {
    //Receber o id enviado na URL
    const {id} = req.params;

    //Recuperar o registro do BD
    const aboutsCompanies = await db.AboutsCompanies.findOne({
        //Indicar quais colunas recuperar
        attributes:['id','titleAboutsCompanies', 'descAboutsCompanies', 'imageAboutsCompanies', 'situationAboutId', 'createdAt', 'updatedAt'],
        // Buscar dados na tabela secundária
        //Acrescentando condição para indicar qual registro deve ser retornado do BD
            where: {
                id 
            },
        include: [{
            model: db.SituationsAbouts,
            attributes: ['nameSituation']
        }]
    });


    //Acessa o IF se encontrar o registro no BD
    if(aboutsCompanies){
        res.render("admin/aboutsCompanies/view", { layout: 'main', profile: req.user.dataValues, sidebarAboutsSite: true, aboutsCompanies});

    }else{
        //Criar mensagem de ERRO
        req.flash("danger_msg", "Erro: não foi encontrado informações sobre empresa!");

        //Redirecionar o usuário
        res.redirect('/abouts-companies-site')
    }

});

// Criar a rota para página com formulário cadastrar sobre empresa, usar a função eAdmin com middleware para verificar se o usuário está logado
router.get('/add', eAdmin, async (req, res) => {

    // Enviar dados para o formulário
    var dataForm = [];

    // Recuperar as situações do banco de dados
    const situationAbout = await db.SituationsAbouts.findAll({
        // Indicar quais colunas recuperar
        attributes: ['id', 'nameSituation'],

        // Ordenar os registros pela coluna nameSituation na forma crescente
        order: [['nameSituation', 'ASC']]
    });

    // Acessa o IF quando encontrar situações no banco de dados e atribui para variável enviar dados para o formulário
    if (situationAbout) {
        dataForm['situations'] = situationAbout;
    }

    // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
    res.render('admin/aboutsCompanies/add', { layout: 'main', profile: req.user.dataValues, data: dataForm, sidebarAboutsSite: true });

});

// Criar a rota para receber os dados do formulário cadastrar, usar a função eAdmin com middleware para verificar se o usuário está logado
router.post('/add', eAdmin, upload.single('imageAboutsCompanies'), async (req, res) => {
    // Receber os dados do formulário
    var data = req.body;

    // Enviar dados para o formulário
    var dataForm = req.body;

    // Acessa o IF quando a extensão da imagem é inválida
    if (!req.file) {
        // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
        return res.render('admin/aboutsCompanies/add', { layout: 'main', profile: req.user.dataValues, data: dataForm, sidebarAboutsSite: true, danger_msg: "Erro: Selecione uma imagem válida JPEG ou PNG!" });
    }

    // Recuperar as situações do banco de dados
    const situationsAbouts = await db.SituationsAbouts.findAll({
        // Indicar quais colunas recuperar
        attributes: ['id', 'nameSituation'],

        // Ordenar os registros pela coluna nameSituation na forma crescente
        order: [['nameSituation', 'ASC']]
    });

    // Acessa o IF quando encontrar situações no banco de dados e atribui para variável enviar dados para o formulário
    if (situationsAbouts) {
        dataForm['situations'] = situationsAbouts;
    }

    // Recuperar a situação do banco de dados
    const situationAbout = await db.SituationsAbouts.findOne({
        // Indicar quais colunas recuperar
        attributes: ['id', 'nameSituation'],

        // Acrescentado condição para indicar qual registro deve ser retornado do banco de dados
        where: {
            id: data.situationAboutId
        },

        // Ordenar os registros pela coluna nameSituation na forma crescente
        order: [['nameSituation', 'ASC']]
    });

    // Acessa o IF quando encontrar a situação selecionada pelo usuário no formulário no banco de dados e atribui para variável enviar dados para o formulário
    if (situationAbout) {
        dataForm['situation'] = situationAbout;
    }
    // Fim enviar dados para o formulário

    // Validar os campos utilizando o yup
    const schema = yup.object().shape({
        situationAboutId: yup.string("Erro: Necessário preencher o campo situação!")
            .required("Erro: Necessário preencher o campo situação!"),
        descAboutsCompanies: yup.string("Erro: Necessário preencher o campo descrição!")
            .required("Erro: Necessário preencher o campo descrição!"),
        titleAboutsCompanies: yup.string("Erro: Necessário preencher o campo título!")
            .required("Erro:  Necessário preencher o campo título!"),
    });

    // Verificar se todos os campos passaram pela validação
    try {
        await schema.validate(data);
    } catch (error) {
        // Pausar o processamento e carregar a view enviando os dados que o usuário havia preenchido no formulário
        return res.render("admin/aboutsCompanies/add", { layout: 'main', profile: req.user.dataValues, sidebarAboutsSite: true, data: dataForm, danger_msg: error.errors });
    }

    data['imageAboutsCompanies'] = req.file.filename;

    /*console.log(data);

    console.log(data);
    return res.send(data);*/

    // Cadastrar no banco de dados
    db.AboutsCompanies.create(data).then((dataAbout) => {

        // Criar a mensagem de cadastrado com sucesso
        req.flash("success_msg", "Sobre empresa cadastrado com sucesso!");

        // Redirecionar o usuário após cadastrar para a página visualizar
        res.redirect('/abouts-companies-site/view/' + dataAbout.id);

    }).catch(() => {
        // Pausar o processamento e carregar a view enviando os dados que o usuário havia preenchido no formulário
        return res.render("admin/aboutsCompanies/add", { layout: 'main', profile: req.user.dataValues, sidebarAboutsSite: true, data: dataForm, danger_msg: "Erro: Sobre empresa não cadastrado com sucesso!" });
    });

});
//Criar a rota para a pág editar os detalhes do registros
router.get('/edit/:id', eAdmin, async (req, res) => {
    //Receber o id enviado na URL
    const {id} = req.params;

    //Recuperar o registro do BD
    const aboutsCompanies = await db.AboutsCompanies.findOne({
        //Indicar quais colunas recuperar
        attributes:['id','titleAboutsCompanies', 'descAboutsCompanies', 'situationAboutId'],
        // Buscar dados na tabela secundária
        //Acrescentando condição para indicar qual registro deve ser retornado do BD
            where: {
                id 
            },
        include: [{
            model: db.SituationsAbouts,
            attributes: ['nameSituation']
        }]
    });

        //Acessa o IF se encontrar registro no BD
        if(aboutsCompanies){
            //Enviar dados para o formulário
            var dataForm = aboutsCompanies.dataValues;

            //Recuperar as situações no BD
            const situationsAbouts = await db.SituationsAbouts.findAll({
                //Indicar quais colunas Recuperar
                attributes: ['id', 'nameSituation'],
                //Ordenar os registros pela coluna nameSituation na forma crescente
                order:[['nameSituation', 'ASC']]
            });
        //Acessa o IF quando encontrar situações no BD e atribui para variavel enviar dados para o formulário
        if (situationsAbouts){
            dataForm['situations'] = situationsAbouts;
        }
        // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
        res.render('admin/aboutsCompanies/edit', { layout: 'main', profile: req.user.dataValues, data: dataForm, sidebarAboutsSite: true });
        } else {
        // Criar a mensagem de erro
        req.flash("danger_msg", "Erro: Sobre empresa não encontrado!");
        // Redirecionar o usuário
        res.redirect('/abouts-companies-site?page=1');
    }  
});

//Criar a rota para receber os dados do formulário editar usuario
router.post('/edit', eAdmin, async (req, res) =>{
        //Receber dados do formulário
        var data = req.body;
    
        //Inicio enviar dados para formulario
        //Enviar dados para o formulário
        var dataForm = req.body;


        //Recuperar as situações no BD
        const situationsAbouts = await db.SituationsAbouts.findAll({
            //Indicar quais colunas Recuperar
            attributes: ['id', 'nameSituation'],

            //Ordenar os registros pela coluna nameSituation na forma crescente
            order:[['nameSituation', 'ASC']]
        });

    //Acessa o IF quando encontrar situações no BD e atribui para variavel enviar dados para formulário
    if(situationsAbouts){
        dataForm['situations'] = situationsAbouts;
    } 
     //Recuperar as situações no BD
     const situationAbout = await db.SituationsAbouts.findOne({
        //Indicar quais colunas Recuperar
        attributes: ['id', 'nameSituation'],
         // Acrescentado condição para indicar qual registro deve ser retornado do banco de dados
         where: {
            id: data.situationAboutId
        },
        //Ordenar os registros pela coluna nameSituation na forma crescente
        order:[['nameSituation', 'ASC']]
    });
    if(situationAbout){
        dataForm['situation'] = 'situationAbout';

    }
    //Fim enviar dados para formulário
    //Validar se o usuario preencheu todos os campos
    const schema = yup.object().shape({
        id:yup.string("Erro: Preenchimento incorreto do formulário!")
            .required("Erro:Preenchimento incorreto do formulário!"),
        situationAboutId: yup.string("Erro: Necessário preencher o campo situação!")
            .required("Erro: Necessário preencher o campo situação!"),
        descAboutsCompanies: yup.string("Erro: Necessário preencher o campo descrição")
            .required("Erro:  Necessário preencher o campo descrição"),
        titleAboutsCompanies: yup.string("Erro: Necessário preencher o campo título!")
            .required("Erro: Necessário preencher o campo título!")
        });
        // Verificar se todos os campos passaram pela validação
        try {
            await schema.validate(data);
        } catch (error) {
        //Pausa o processamento e carrega a view enviando os dados que o usuario havua preenchido no formulário
            return res.render("admin/aboutsCompanies/edit", {layout: 'main',profile:req.user.dataValues,  sidebarAboutsSite: true, data: dataForm, danger_msg: error.errors});
        }
    // Recuperar o registro do banco de dados
    //Editar no BD
    db.AboutsCompanies.update(data, { where: { id: data.id} }).then(() =>{
        //Criar a mensagem de usuario editado com sucesso
        req.flash("success_msg", "Contéudo dos sobre empresa da página Home editado com sucesso!");
        
        //Redirecionar o usuario apos editar
        res.redirect('/abouts-companies-site?page=1');
        
    }).catch(() =>{
        
        //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
        return res.render('admin/aboutsCompanies/edit', { layout: 'main', profile:req.user.dataValues, data: dataForm, sidebarAboutsSite: true, danger_msg:"ERRO: Contéudo do sobre empresa NÃO editado com sucesso!"});
    });
});

router.get('/edit-image/:id', eAdmin, async (req, res) => {
    // Receber o id enviado na URL
    const { id } = req.params;

    // Recuperar o registro do banco de dados
    const aboutsCompanies = await db.AboutsCompanies.findOne({
        // Indicar quais colunas recuperar
        attributes: ['id', ['imageAboutsCompanies', 'imageOld']],
        // Acrescentar condição para indicar qual registro deve ser retornado do banco de dados
        where: {
            id
        }
    });

    // Acessa o IF se encontrar o registro no banco de dados
    if (aboutsCompanies) {
        // Enviar dados para o formulário
        var dataForm = aboutsCompanies.dataValues;

        // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
        res.render('admin/aboutsCompanies/edit-image', { layout: 'main', profile: req.user.dataValues, data: dataForm, sidebarAboutsSite: true });
    } else {
        // Criar a mensagem de erro
        req.flash("danger_msg", "Erro: Imagem não encontrado!");
        // Redirecionar o usuário
        res.redirect('/abouts-companies-site?page=1');
    }
});

// Criar a rota para receber os dados do formulário editar imagem do usuário, usar a função eAdmin com middleware para verificar se o usuário está logado
router.post('/edit-image', eAdmin, upload.single('imageAboutsCompanies'), async (req, res) => {
    // Receber os dados do formulário
    var data = req.body;

    // Enviar dados para o formulário
    var dataForm = req.body;

    // Acessa o IF quando a extensão da imagem é inválida
    if (!req.file) {
        //console.log(req.file);
        // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
        return res.render('admin/aboutsCompanies/edit-image', { layout: 'main', profile: req.user.dataValues, data: dataForm, sidebarAboutsSite: true, danger_msg: "Erro: Selecione uma imagem válida JPEG ou PNG!" });

    }

     // Recuperar o registro do banco de dados
     const aboutsCompanies = await db.AboutsCompanies.findOne({
        // Indicar quais colunas recuperar
        attributes: ['id', 'imageAboutsCompanies'],

        // Acrescentar condição para indicar qual registro deve ser retornado do banco de dados
        where: {
            id: data.id
        }
    });

    
    // Verificar se o usuário tem imagem salva no banco de dados
    if (aboutsCompanies.dataValues.imageAboutsCompanies) {
        // Criar o caminho da imagem que o usuário tem no banco de dados
        var imgOld = "./public/images/about/" + aboutsCompanies.dataValues.imageAboutsCompanies;

        // fs.access usado para testar as permissões do arquivo
        fs.access(imgOld, (err) => {
            // Acessa o IF quando não tiver nenhum erro
            if (!err) {
                // Apagar a imagem antiga
                fs.unlink(imgOld, () => { })
            }
        });
    }

     // Editar no banco de dados
     db.AboutsCompanies.update(
        { imageAboutsCompanies: req.file.filename },
        { where: { id: data.id } })
        .then(() => {
            // Criar a mensagem de usuário editado com sucesso
            req.flash("success_msg", "Imagem editada com sucesso!");

            // Redirecionar o usuário após editar para a página visualizar
            res.redirect('/abouts-companies-site/view/' + data.id);
        }).catch(() => {
            // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
            res.render('admin/aboutsCompanies/edit-image', { layout: 'main', profile: req.user.dataValues, data: dataForm, sidebarAboutsSite: true, danger_msg: "Erro: Imagem não editada com sucesso!" });
        });

});

//Criar a rota para apagar os dados do formulário editar usuario
router.get('/delete/:id', async(req, res) => {

    //Recuperar o registro no BD
    const aboutsCompanies = await db.AboutsCompanies.findOne({
        //Indicar quais colunas recuperar
        attributes:['id', 'imageAboutsCompanies'],

        //Acrescentar condição para indicar qual registro deve ser retornado do BD
        where: {
            id: req.params.id
        }
    });

    //Verificar se existe a imagem salva no BD
    if(aboutsCompanies.dataValues.imageAboutsCompanies) {
        var imgOld = "./public/images/about/" + aboutsCompanies.dataValues.imageAboutsCompanies;
        //fs.access usado para testar as permissões do arquivo
        fs.access(imgOld, (err) => {
            //Acessa o IF quando nãotiver nenhum erro
            if (!err) {
                //apagar a imagem antiga
                fs.unlink(imgOld, () => { })
            }
        });
    }

    //Apagar situação sobre empresa no bd
    db.AboutsCompanies.destroy({
        //Acrescentar o WHERE na instrução SQL indicando qual registro excluir no BD
        where: {
            id: req.params.id
        }
    }).then(() => {
        //Criar a mensagem situação apagada com sucesso
        req.flash("success_msg", "Situação sobre empresa apagada com sucesso");

        //Redirecionar a pagina situação sobre empresa
        res.redirect('/abouts-companies-site?page=1');  
    }).catch(() => {
        //Criar a mensagem situação apagada com sucesso
        req.flash("error_msg", "Situação sobre empresa não apagada com sucesso");

        //Redirecionar a pagina situação após não sobre empresa
        res.redirect('/aboutsCompanies/view/' + req.params.id);  
    });
});

//Exportar a instrução que está dentro da constante router
module.exports = router;