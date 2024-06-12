//incluir as bibliotecas
//gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');
//utilizado para manipular as rotas da aplicação
const router = express.Router();
//Arquvo com a funcionalidade para verificar se o usuário está logado
const {eAdmin} = require("../helpers/eAdmin");
//utilizado para manipular as rotas da aplicação
const bcrypt = require('bcryptjs');
//Validar input do formulario
const yup = require('yup');
//Incluir o arquivo que possui a conexão com BD
const db = require('./../db/models');
//Operador do sequelize
const{Op} = require("sequelize");
//Incluir o arquivo com função de upload
const upload = require('../helpers/uploadImgUser');
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
    const countUser = await db.users.count();

    //Acessa o IF quando encontrar o registro no BD
    if(countUser !==0 ){
        //Calcular a ultima pagina
        lastPage = Math.ceil(countUser / limit);
    }else{
        //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo, enviar msg de erro
        res.render("admin/users/list", {layout: 'main', profile:req.user.dataValues,  sidebarUsers: true, danger_msg: 'ERRO: Nenhum usuário encontrado!'})
    }

    //Recuperar todos os usuarios do BD
    await db.users.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id', 'name', 'email'],
        //Ordenar os registros pela coluna id na fora decrescente
        order:[['id', 'DESC']],
        //Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    }).then((users) => {
        //Acessa o if quando retornar registro do BD
        if (users.length !==0) {
            //Criar objeto com as informações para paginação
            var pagination = {
                //caminho
                path: '/users',
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
            res.render("admin/users/list", {layout: 'main', profile:req.user.dataValues,  sidebarUsers: true, users: users.map(id => id.toJSON()), pagination})
        }else{
            //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo enviar mensagem de erro
            res.render("admin/users/list", {layout: 'main', profile:req.user.dataValues, sidebarUsers: true, danger_msg: 'ERRO: Nenhum usuário encontrado!'})
        }
       
    }).catch(() =>{
        //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item do menu deve ficar ativo enviar mensagem de erro
        res.render("admin/users/list", {layout: 'main', profile:req.user.dataValues,  sidebarUsers: true, danger_msg: 'ERRO: Nenhum usuário encontrado!'})
    })
});

//Criar a rota para a pág visualizar os detalhes do registros
router.get('/view/:id', eAdmin, async (req, res) => {
    //Receber o id enviado na URL
    const {id} = req.params;

    //Recuperar o registro do BD
    const user = await db.users.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id', 'name', 'email', 'image','situationId', 'createdAt', 'updatedAt'],
        //Acrescentando condição para indicar qual registro deve ser retornado do BD
        where: {
            id 
        },
        //Buscar dados na tabela secundária
        include: [{
        model: db.situations,
        attributes: ['nameSituation']
    }]
    });
   //Acessa o if se encontrar o registro no BD
   if(user){
        res.render("admin/users/view", {layout: 'main',profile:req.user.dataValues, sidebarUsers: true, user});
   }else{
        //Criar a mensagem de erro
        req.flash("danger_msg", "ERRO: Usuário não encontrado!");
        //Redirecionar o usuário
        res.redirect('/users');
   }
});

//Criar a rota para pág com formulário cadastrar usuário
router.get('/add', eAdmin, async (req, res) => {

    //Enviar dados para o formulário
    var dataForm = [];

    //Recuperar as situações do BD
    const situations = await db.situations.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id', 'nameSituation'],
        //Ordenar os registros pela coluna nameSituations na forma crescente
        order:[['nameSituation', 'ASC']]
    });

    //Acessa o IF quando encontrar situações no BD e atribui para variavel enviar dados para formulário
    if(situations){
        dataForm['situations'] = situations;
    }

    //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
    res.render('admin/users/add', {layout: 'main',profile:req.user.dataValues, data: dataForm, sidebarUsers: true});
});

//Criar a rota para pág com formulário cadastrar usuário
router.post('/add', eAdmin, async (req, res) => {

    //Receber dados do formulario
    var data = req.body;

    //Inicio enviar dados para formulario
    //Enviar dados para o formulário
    var dataForm = req.body;
    var password = dataForm['password'];

    //Recuperar as situações do BD
    const situations = await db.situations.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id', 'nameSituation'],
        //Ordenar os registros pela coluna nameSituations na forma crescente
        order:[['nameSituation', 'ASC']]
    });

    //Acessa o IF quando encontrar situações no BD e atribui para variavel enviar dados para formulário
    if(situations){
        dataForm['situations'] = situations;
    } 

    //Recuperar as situação do BD
    const situation = await db.situations.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id', 'nameSituation'],

        //Acrescentando condição para indicar qual registro deve ser retornado do BD
        where:{
            id: data.situationId
        },
        //Ordenar os registros pela coluna nameSituations na forma crescente
        order:[['nameSituation', 'ASC']]
    });

        //Acessa o IF quando encontrar situações no BD e atribui para variavel enviar dados para formulário
        if(situations){
            dataForm['situation'] = situation;
        } 
    //Fim enviar dados para o firmulário
     
        const schema = yup.object().shape({
        id: yup.string("Erro: Preenchimento incorreto do formulário!")
            .required("Erro: Preenchimento incorreto do formulário!"),
        situationId: yup.string("Erro: Necessário preencher o campo situação!")
            .required("Erro: Necessário preencher o campo situação!"),
         password: yup.string("Erro: Necessário preencher o campo senha!")
            .required("Erro: Necessário preencher o campo senha!")
            .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
         email: yup.string("Erro: Necessário preencher o campo e-mail!")
            .required("Erro: Necessário preencher o campo e-mail!")
            .email("Erro: Necessário preencher o campo e-mail!"),
         name: yup.string("Erro: Necessário preencher o campo nome!")
            .required("Erro: Necessário preencher o campo nome!")
     });
     // Verificar se todos os campos passaram pela validação
     try {
         await schema.validate(data);
     } catch (error) {
        //Pausa o processamento e carrega a view enviando os dados que o usuario havua preenchido no formulário
         return res.render("admin/users/add", {layout: 'main',profile:req.user.dataValues,  sidebarUsers: true, data: dataForm, danger_msg: error.errors});
     }
     // Recuperar o registro do banco de dados
 
     const user = await db.users.findOne({
        //indicar quais colunas recuperar
        attributes: ['id', 'email'],
        where: {
            email: data.email
        }
    });

    if(user){
        //Pausar processamento e carregar view enviando os dados que o usuario havia 
        //preenchido no formulario
        return res.render("admin/users/add", {layout: 'main',profile:req.user.dataValues, sidebarUsers: true, data: dataForm, danger_msg: "ERRO:Este e-mail já foi cadastrado"});
    }
    
      //Criptografar a senha
      data.password = await bcrypt.hash(data.password, 8);

    //Cadastrar no BD
    db.users.create(data).then((dataUser) => {
        
        //Criar a mensagem de usuario cadastrado 
        req.flash("success_msg", "Usuário cadastrado com sucesso!");
        //res.redirect('/users?page=1');
        res.redirect('/users/view/' + dataUser.id);
    }).catch(() => {
        //Pausar processamento e carregar view enviando os dados que o usuario havia 
        //preenchido no formulario
        dataForm['password'] = password;
        return res.render("admin/users/add", {layout: 'main',profile:req.user.dataValues,  data: dataForm, danger_msg: "ERRO: Usuário não cadastrado com sucesso!"});
     });
 
});

//Criar a rota para pág com formulário edit usuário
router.get('/edit/:id', eAdmin, async (req, res) => {
    

    //Receber o id enviado na URL
    const { id } = req.params;

    //Recuperar o registro do BD
   const user = await db.users.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id', 'name', 'email', 'situationId'],
        //Acrescentar condição para indicar qual registro deve ser retornado do BD
        where: {
            id
        },
        //Buscar dados na tabela secundária
        include:[{
            model: db.situations,
            attributes: ['id', 'nameSituation']
        }]
    });    
    //Acessa o IF se encontrar o registro no bd
    if (user) {
        //Enviar dados para o formulário
        var dataForm = user.dataValues;

        //Recuperar as situações do BD
        const situations = await db.situations.findAll({
            //Indicar quais colunas recuperar
            attributes: ['id', 'nameSituation'],
            //Ordenar os registros pela coluna nameSituation de forma crescente
            order: [['nameSituation', 'ASC']]
        });
        //Acessa o if quando encontrar situações no BD e atribui para variável enviar dados para forms
        if(situations){
            dataForm['situations'] = situations;
        }

    //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
    res.render('admin/users/edit', { layout: 'main',profile:req.user.dataValues,  data: dataForm, sidebarUsers: true});
    } else {
    //Criar mensagem de erro
    req.flash("danger_msg", "ERRO: Usuário não encontrado!");
    //Redirecionar user
    res.redirect('/users?page=1');
    }   
});

//Criar a rota para receber os dados do formulário editar usuario
router.post('/edit', eAdmin, async (req, res) =>{
    //Receber dados do formulário
    var data = req.body;
   
    //Inicio enviar dados para formulario
    //Enviar dados para o formulário
    var dataForm = req.body;

    
    //Recuperar as situações do BD
    const situations = await db.situations.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id', 'nameSituation'],
        //Ordenar os registros pela coluna nameSituations na forma crescente
        order:[['nameSituation', 'ASC']]
    });

    //Acessa o IF quando encontrar situações no BD e atribui para variavel enviar dados para formulário
    if(situations){
        dataForm['situations'] = situations;
    } 
    //Recuperar as situação do BD
    const situation = await db.situations.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id', 'nameSituation'],

        //Acrescentando condição para indicar qual registro deve ser retornado do BD
        where:{
            id: data.situationId
        },
        //Ordenar os registros pela coluna nameSituations na forma crescente
        order:[['nameSituation', 'ASC']]
    });
    
    //Acessa o IF quando encontrar situações no BD e atribui para variavel enviar dados para formulário
    if(situations){
        dataForm['situation'] = situation;
    } 
    //Fim enviar dados para o firmulário
    
    
    //Validar se o usuario preencheu todos os campos
    const schema = yup.object().shape({
        situationId: yup.string("Erro: Necessário preencher o campo situação!")
                .required("Erro: Necessário preencher o campo situação!"),
            email: yup.string("Erro: Necessário preencher o campo e-mail!")
                .required("Erro: Necessário preencher o campo e-mail!")
                .email("Erro: Necessário preencher o campo e-mail!"),
            name: yup.string("Erro: Necessário preencher o campo nome!")
                .required("Erro: Necessário preencher o campo nome!")
        });
        // Verificar se todos os campos passaram pela validação
        try {
            await schema.validate(data);
        } catch (error) {
        //Pausa o processamento e carrega a view enviando os dados que o usuario havua preenchido no formulário
            return res.render("admin/users/edit", {layout: 'main',profile:req.user.dataValues,  sidebarUsers: true, data: dataForm, danger_msg: error.errors});
        }
    // Recuperar o registro do banco de dados
    
    const user = await db.users.findOne({
        //indicar quais colunas recuperar
        attributes: ['id', 'email'],
        where: {
            email: data.email,
            id:{
                //Operado de negação para ignorar o registro do usuario que está sendo editado
                [Op.ne]:data.id
            }
        }
    });

    if(user){
        //Pausar processamento e carregar view enviando os dados que o usuario havia 
        //preenchido no formulario
        return res.render("admin/users/edit", {layout: 'main',profile:req.user.dataValues, sidebarUsers: true, data: dataForm, danger_msg: "ERRO:Este e-mail já foi cadastrado"});
    }

    //Editar no BD
    db.users.update(data, { where: { id: data.id} }).then(() =>{
        //Criar a mensagem de usuario editado com sucesso
        req.flash("success_msg", "Usuário editado com sucesso!");
        //Redirecionar o usuario apos editar
        //res.redirect('/users?page=1');
        //Redirecionar o usuario apos editar para a pagina visualizar
        res.redirect('/users/view/' + data.id);
        
    }).catch(() =>{
        
        //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
        res.render('admin/users/edit', { layout: 'main',profile:req.user.dataValues, data: dataForm, sidebarUsers: true});
    });
});

router.get('/edit-password/:id', eAdmin, async (req, res) => {

    //Receber o id enviado na URL
    const { id } = req.params;

    //Recuperar o registro do BD
   const user = await db.users.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id'],
        //Acrescentar condição para indicar qual registro deve ser retornado do BD
        where: {
            id
        }

   });
    // Acessa o IF se encontrar o registro no banco de dados
    if (user) {
        // Enviar dados para o formulário
        var dataForm = user.dataValues;

        // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
        res.render('admin/users/edit-password', { layout: 'main',profile:req.user.dataValues, data: dataForm, sidebarUsers: true });
    } else {
        // Criar a mensagem de erro
        req.flash("danger_msg", "Erro: Usuário não encontrado!");
        // Redirecionar o usuário
        res.redirect('/users?page=1');
    }
});

//Criar a rota para receber os dados do formulário editar senha
router.post('/edit-password', eAdmin, async (req, res) =>{
    //Receber dados do formulário
    var data = req.body;
   
    //Inicio enviar dados para formulario
    //Enviar dados para o formulário
    var dataForm = req.body;

    //Validar se o usuario preencheu todos os campos
    const schema = yup.object().shape({
        password: yup.string("Erro: Necessário preencher o campo Senha!")
            .required("Erro: Necessário preencher o campo Senha!"),
        password: yup.string("Erro: Necessário preencher o campo Senha!")
            .required("Erro: Necessário preencher o campo Senha!")
            .min(6, "Erro: A senha deve ter no minimo 6 caracteres!"),

    });
     // Verificar se todos os campos passaram pela validação
     try {
        await schema.validate(data);
    } catch (error) {
       //Pausa o processamento e carrega a view enviando os dados que o usuario havia preenchido no formulário
        return res.render("admin/users/edit-password", {layout: 'main',profile:req.user.dataValues, sidebarUsers: true, data: dataForm, danger_msg: error.errors});
    }
    //Criptografar a senha
    data.password = await bcrypt.hash(data.password, 8);

    // Editar no banco de dados
    db.users.update(data, { where: {id: data.id} }).then(() => {
        // Criar a mensagem de usuário editado com sucesso
        req.flash("success_msg", "Senha editada com sucesso!");
        // Redirecionar o usuário após editar
        //res.redirect('/users?page=1');

        // Redirecionar o usuário após editar para a página visualizar
        res.redirect('/users/view/' + data.id);

    }).catch(() => {
        // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
        res.render('admin/users/edit-password', { layout: 'main',profile:req.user.dataValues, data: dataForm, sidebarUsers: true, danger_msg: "Senha não editada com sucesso!" });
    });

});

//Criar a rota editar a imagem usuário no BD, usar a função eAdmin com middleware para verificar se o usuario esta logado
router.get('/edit-image/:id', eAdmin, async (req, res) => {
    //Receber o id enviado na URL
    const { id } = req.params;

    //Recuperar o registro do BD
    const user = await db.users.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id', 'name', [ 'image', 'imageOld']],
        //Acrescentar condição para indicar qual registro deve ser retornado do BD
        where: {
            id
        }
    });
    //Acessa o IF se encontarar o  registro no BD
    if (user) {
        //Enviar dados para o formulario
        var dataForm = user.dataValues;

        //Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
        res.render('admin/users/edit-image', {layout: 'main',profile:req.user.dataValues, data: dataForm, sidebarUsers: true});
    }else{
        // Criar a mensagem de erro
        req.flash("danger_msg", "Erro: Usuário não encontrado!");
        // Redirecionar o usuário
        res.redirect('/users?page=1');
    }
});

//Criar a rota receber a imagem usuário editar imagem do usuario,usar a função eAdmin com middleware para verificar se o usuario esta logado
router.post('/edit-image', eAdmin, upload.single('image'), async (req, res) => {
    //Receber os dados do fornulario
    var data = req.body;

    //Enviar dados para o formulário
    var dataForm = req.body;
  
    //Acessa o IF quando a extensão da imagem é válida
    if (req.file) {

        //Recuperar o registro do BD
        await db.users.findOne({
            //Indicar quais colunas recuperar
            attributes: ['id', 'image'],

            //Acrescentar condição para indicar qual registro deve ser retornado do BD
            where: {
                id: data.id
            }
        }).then((user) => {
            //console.log(user);
            //Verificar se o usuario tem imagem salva no BD
            if(user.dataValues.image){
                //Criar o caminho da imagem que o usuario tem no BD
                var imgOld = "./public/images/users/" + user.dataValues.image;

                //fs.access usado para testar as permissões do arquivo
                fs.access(imgOld, (err) => {
                    //Acessa o IF quando não tiver nenhum erro
                    if (!err) {
                        //Apagar imagem antiga
                        fs.unlink(imgOld, () => { })
                    }
                });

            }

        });
        //Editar no BD
        db.users.update({ image: req.file.filename}, {where: {id: data.id}}).then(() =>{
            //Criar a mensagem de imagem do usuario editada com sucesso
            req.flash("success_msg", "Imagem editada com sucesso!");

            //Redirecionar o usuario apos editar para a pagina visualizar
            res.redirect('/users/view/' + data.id);
        }).catch(() =>{ 
            // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
            res.render('admin/users/edit-image', { layout: 'main', profile:req.user.dataValues, data: dataForm, sidebarUsers: true, danger_msg: "ERRO: Imagem não editada com sucesso! " });
        });
    }else{
        // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
        res.render('admin/users/edit-image', { layout: 'main', profile:req.user.dataValues, data: dataForm, sidebarUsers: true, danger_msg: "ERRO: Imagem invalida, Selecione uma imagem do formato JPEG ou PNG " });
    }
});

//Criar a rota apagar usuário no BD, usar a função eAdmin com middleware para verificar se o usuario esta logado
router.get('/delete/:id', async (req, res) =>{

    
    //Recuperar o registro do BD
    const user = await db.users.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id', 'image'],

        //Acrescentar condição para indicar qual registro deve ser retornado do BD
        where: {
            id: req.params.id
        }
    });

    //Verificar se o usuario tem imagem salva no BD
    if(user.dataValues.image){
        //Criar o caminho da imagem que o usuario tem no BD
        var imgOld = "./public/images/users/" + user.dataValues.image;

        //fs.access usado para testar as permissões do arquivo
        fs.access(imgOld, (err) => {
            //Acessa o IF quando não tiver nenhum erro
            if (!err) {
                //Apagar imagem antiga
                fs.unlink(imgOld, () => { })
            }
        });

    }

    //Apagar usuário no BD utilizando a MODELS users
    db.users.destroy({
        //acrescentar o WHERE na instrução SQL indicando qual registro excluir no BD
        where:{
            id: req.params.id
        }
    }).then(() =>{
        //Criar a mensagem de usuário apagado com sucesso
        req.flash("success_msg", "Usuário apagado com sucesso!");

        //Redirecionar o usuario após apagar com sucesso
        res.redirect('/users?page=1');
    }).catch(() =>{
        //Criar a mensagem de usuário não apagado
        req.flash("danger_msg", "Usuário não apagado com sucesso!");

        //Redirecionar o usuario após não apagar
        //res.redirect('/users?page=1');
        res.redirect('/users/view/' + req.params.id);
    });
});


//exportar a instrução que está dentro da constante router
module.exports = router;