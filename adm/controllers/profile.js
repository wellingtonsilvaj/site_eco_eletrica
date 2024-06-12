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
const db = require('../db/models');
//Operador do sequelize
const{Op} = require("sequelize");
//Incluir o arquivo com função de upload
const upload = require('../helpers/uploadImgUser');
//O modulo fs permite interagir com o sistema de arquivos
const fs = require('fs');

//criar rota do listar usuários, usar a função eAdmin com meddleware para verificar se o usuario está logado
router.get('/', eAdmin, async (req, res) => {

    //Recuperar o registro do BD
    const user = await db.users.findOne({
    //Indicar quais colunas recuperar
    attributes: ['id', 'name', 'email', 'image','situationId', 'createdAt'],
    //Acrescentando condição para indicar qual registro deve ser retornado do BD
    where: {
    id: req.user.dataValues.id
    },
    //Buscar dados na tabela secundária
    include: [{
    model: db.situations,
    attributes: ['nameSituation']
}]
});
    
    //Acessa o if se encontrar o registro no BD
    if(user){
    res.render("admin/profile/view", {layout: 'main', profile: req.user.dataValues, user});
    }else{
    //Criar a mensagem de erro
    req.flash("danger_msg", "ERRO: Usuário não encontrado!");
    //Redirecionar o usuário
    res.redirect('/login');
}   
});

//Criar a rota para pág com formulário edit usuário
router.get('/edit', eAdmin, async (req, res) => {

    //Recuperar o registro do BD
    const user = await db.users.findOne({
    //Indicar quais colunas recuperar
    attributes: ['id', 'name', 'email', 'situationId'],
    //Acrescentar condição para indicar qual registro deve ser retornado do BD
    where: {
        id: req.user.dataValues.id
    }
});    
    
    //Acessa o IF se encontrar o registro no bd
    if(user) {
    //Enviar dados para o formulário
    var dataForm = user.dataValues;

    //Pausar processamento e carregar view editar perfil
    res.render('admin/profile/edit', { layout: 'main', profile: req.user.dataValues, data: dataForm});
    }else{
    //Criar mensagem de erro
    req.flash("danger_msg", "ERRO: Usuário não encontrado!");
    //Redirecionar user
    res.redirect('/login');
    }   
});

//Criar a rota para receber os dados do formulário editar perfil
router.post('/edit', eAdmin, async (req, res) =>{

    //Receber os dados do formulário
    var data = req.body;

    //Enviar dados para o formulário
    var dataForm = req.body;
    
    //Validar se o usuario preencheu todos os campos
    const schema = yup.object().shape({
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
        return res.render("admin/profile/edit", {layout: 'main', profile: req.user.dataValues,  data: dataForm, danger_msg: error.errors });
    }
    // Recuperar o registro do banco de dados

    const user = await db.users.findOne({
        //indicar quais colunas recuperar
        attributes: ['id', 'email'],
        where: {
            email: data.email,
            id: {
                // Operador de negação para ignorar o registro do usuário que está sendo editado
                [Op.ne]: req.user.dataValues.id
            }
    }
    });

    if(user){
        //Pausar processamento e carregar view enviando os dados que o usuario havia preenchido
        //preenchido no formulario
        return res.render("admin/profile/edit", {layout: 'main', profile: req.user.dataValues, data: dataForm, danger_msg: "ERRO:Este e-mail já foi cadastrado"});
    }
        //Editar no BD
        db.users.update(data, { where: { id: req.user.dataValues.id} }).then(() =>{

            req.user.dataValues.name = data.name;
            req.user.dataValues.email = data.email;
            
             
        //Criar a mensagem de usuario editado com sucesso
        req.flash("success_msg", "Perfil editado com sucesso!");
        //Redirecionar o usuario apos editar
        res.redirect('/profile');
        
    }).catch(() =>{
        
        //Pausar processamento e carregar view, carregat o layout main
        res.render('admin/profile/edit', { layout: 'main', profile: req.user.dataValues, data: dataForm, danger_msg: "Perfil não editado com sucesso!"});
    });
});

//Criar a rota para receber os dados do formulário editar senha do usuario
router.get('/edit-password', eAdmin, async (req, res) =>{

    //Recuperar o registro do BD
    const user = await db.users.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id'],
        //Acrescentar condição para indicar qual registro deve ser retornado do BD
        where: {
            id: req.user.dataValues.id
        }
 
    });
    
    // Acessa o IF se encontrar o registro no banco de dados
    if (user) {
        // Enviar dados para o formulário
        var dataForm = user.dataValues;

        // Pausar o processamento, carregar a view, carregar o layout main
        res.render('admin/profile/edit-password', { layout: 'main', profile: req.user.dataValues, data: dataForm });
    } else {
        // Criar a mensagem de erro
        req.flash("danger_msg", "Erro: Usuário não encontrado!");
        // Redirecionar o usuário
        res.redirect('/profile');
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
        return res.render("admin/profile/edit-password", {layout: 'main', profile: req.user.dataValues, data: dataForm, danger_msg: error.errors});
    }
    
    //Criptografar a senha
    data.password = await bcrypt.hash(data.password, 8);

    // Editar no banco de dados
    db.users.update(data, { where: {id: req.user.dataValues.id} }).then(() => {
        // Criar a mensagem de senha do perfil editado com sucesso
        req.flash("success_msg", "Senha editada com sucesso!");
        // Redirecionar o usuário após editar para a página visualizar
        res.redirect('/profile');

    }).catch(() => {
        // Pausar o processamento, carregar a view, carregar o layout main
        res.render('admin/profile/edit-password', { layout: 'main' , profile: req.user.dataValues, data: dataForm, danger_msg: "Senha não editada com sucesso!" });
    });

});

//Criar a rota editar a imagem usuário no BD, usar a função eAdmin com middleware para verificar se o usuario esta logado
router.get('/edit-image', eAdmin, async (req, res) => {

    // Recuperar o registro do banco de dados
    const user = await db.users.findOne({
    // Indicar quais colunas recuperar
    attributes: ['id', 'name', ['image', 'imageOld']],
    // Acrescentar condição para indicar qual registro deve ser retornado do banco de dados
    where: {
        id: req.user.dataValues.id
    }
});

// Acessa o IF se encontrar o registro no banco de dados
if (user) {
  // Enviar dados para o formulário
  var dataForm = user.dataValues;

  // Pausar o processamento, carregar a view, carregar o layout main
  res.render('admin/profile/edit-image', { layout: 'main', profile: req.user.dataValues, data: dataForm });
} else {
  // Criar a mensagem de erro
  req.flash("danger_msg", "Erro: Usuário não encontrado!");
  // Redirecionar o usuário
  res.redirect('/login');
}
});

//Criar a rota para receber os dados do formulário editar senha
router.post('/edit-image', upload.single('image'), eAdmin, async (req, res) =>{

     //Receber dados do formulário
     var data = req.body;
   
     //Inicio enviar dados para formulario
     //Enviar dados para o formulário
     var dataForm = req.body;

     //Acessa o IF quando a extensão da imagem é válida
     if (!req.file) {
        // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
        return res.render('admin/profile/edit-image', { layout: 'main', profile: req.user.dataValues, danger_msg: "ERRO: Imagem invalida, Selecione uma imagem do formato JPEG ou PNG " });
     }
        //Recuperar o registro no BD 
        const user = await db.users.findOne({
            //Indicar quais colunas recuperar
            attributes:['id', 'image'],

            //Acrescentar condição para indicar qual registro deve ser retornado do BD
            where: {
                id: req.user.dataValues.id
            }
        });

        //Verificar se o usuario tem imagem salva no BD
        if(user.dataValues.image){
            //Criar o caminho da imagem que o usuario tem no BD
            var imgOld = "./public/images/users/" + user.dataValues.image;

            //fs.access usado para testar as permissões do arquivo 
            fs.access(imgOld, (err) => {
                //Acessao IF quando não tiver nenhum erro
                if (!err) {
                    //Apagar imagem antiga
                    fs.unlink(imgOld, () => { })
                }
            });
        }

        //Editar no BD
        db.users.update({ image: req.file.filename}, {where: {id: req.user.dataValues.id}}).then(() =>{

            req.user.dataValues.image = req.file.filename;

            //Criar a mensagem de imagem do usuario editada com sucesso
            req.flash("success_msg", "Imagem editada com sucesso!");

            //Redirecionar o usuario apos editar para a pagina visualizar
            res.redirect('/profile');
        }).catch(() =>{
            // Pausar o processamento, carregar a view, carregar o layout main, indicar qual item de menu deve ficar ativo
            res.render('admin/profile/edit-image', { layout: 'main', profile: req.user.dataValues, danger_msg: "ERRO: Imagem não editada com sucesso! " });
        });
    
});
//exportar a instrução que está dentro da constante router
module.exports = router;