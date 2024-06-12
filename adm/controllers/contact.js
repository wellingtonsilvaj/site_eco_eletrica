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
const upload = require('../helpers/uploadImgUser');
//O módulo fs permite interagir com o sistema de arquivos
const fs = require('fs');

//criar rota do listar usuários, usar a função eAdmin com meddleware para verificar se o usuario está logado
router.get('/', eAdmin, async (req, res) => {

    //Recuperar o registro do BD
    const contentContact = await db.Contacts.findOne({
        //Indicar quais colunas recuperar
        attributes: ['titleContact', 'subTitleContact', 'iconCompany', 'titleCompany', 'descCompany', 'iconAddress', 'titleAdress', 'descAddress', 'iconEmail', 'titleEmail', 'descEmail', 'titleForm', 'createdAt', 'updatedAt']
    });

    //Acessa o IF se encontrar o registro no BD
    if(contentContact){
        res.render("admin/contact/view", {  layout: 'main', profile: req.user.dataValues, sidebarContactSite: true, contentContact });
    }else{
        //Criar mensagem de ERRO
        req.flash("danger_msg", "ERRO: Não encontramos dados da página contato!");

        //Redirecionar o usuario
        res.redirect('dashboard')
    }
});

//Criar a rota para pág com formulário editar conteudo do topo da pagina home
router.get('/edit-contact', eAdmin, async (req, res) => {
    
    //Recuperar o registro do BD
    const contentContact = await db.Contacts.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id','titleContact', 'SubTitleContact', 'iconCompany', 'titleCompany', 'descCompany', 'iconAddress', 'titleAdress', 'descAddress', 'iconEmail', 'titleEmail', 'descEmail', 'titleForm']
    });

    //Acessa o IF se encontrar o registro no bd
 if (contentContact) {
    //Enviar dados para o formulário
    var dataForm = contentContact.dataValues;


    //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
    res.render('admin/contact/edit-contact', { layout: 'main', profile:req.user.dataValues,  data: dataForm, sidebarContactSite: true}); 
}else{
    //Criar mensagem de erro
    req.flash("danger_msg", "ERRO: Não encontrado conteúdo do topo da página contato!");
    //Redirecionar user
    res.redirect('/dashboard');
}   
}); 



//Criar a rota para receber os dados do formulário editar usuario
router.post('/edit-contact', eAdmin, async (req, res) =>{

  //Receber dados do formulário
  var data = req.body;
   
  //Inicio enviar dados para formulario
  //Enviar dados para o formulário
  var dataForm = req.body;

    
//Validar se o usuario preencheu todos os campos
const schema = yup.object().shape({
    id:yup.string("Erro: Preenchimento incorreto do formulário!")
        .required("Erro:Preenchimento incorreto do formulário!"),
    titleForm: yup.string("Erro: Necessário preencher o campo título do formulário!")
        .required("Erro: Necessário preencher o campo título do formulário!"),
    descEmail: yup.string("Erro: Necessário preencher o campo descrição do email!")
        .required("Erro: Necessário preencher o campo descrição do email!"),
    titleEmail: yup.string("Erro: Necessário preencher o campo título do email")
        .required("Erro: Necessário preencher o campo título do email!"),
    iconEmail: yup.string("Erro: Necessário preencher o campo  ícone do email!")
        .required("Erro: Necessário preencher o campo ícone do email!"),
    descAddress: yup.string("Erro: Necessário preencher o campo descrição do endereço!")
        .required("Erro: Necessário preencher o campo descrição do endereço!"),
    titleAdress: yup.string("Erro: Necessário preencher o campo descrição do endereço!")
        .required("Erro: Necessário preencher o campo título do endereço!"),
    iconAddress: yup.string("Erro: Necessário preencher o campo ícone do endereço!")
        .required("Erro: Necessário preencher o campo ícone do endereço!"),
    descCompany: yup.string("Erro: Necessário preencher o campo descrição sobre empresa!")
        .required("Erro: Necessário preencher o campo descrição sobre empresa!"),
    titleCompany: yup.string("Erro: Necessário preencher o campo título sobre empresa!")
        .required("Erro: Necessário preencher o campo título sobre empresa!"),
    iconCompany: yup.string("Erro: Necessário preencher o campo ícone sobre empresa!")
        .required("Erro: Necessário preencher o campo ícone sobre empresa!"),
    SubTitleContact: yup.string("Erro: Necessário preencher o campo descrição do contato!")
        .required("Erro: Necessário preencher o campo descrição do contato!"),
    titleContact: yup.string("Erro: Necessário preencher o campo título!")
        .required("Erro: Necessário preencher o campo título!")
    });
    // Verificar se todos os campos passaram pela validação
    try {
        await schema.validate(data);
    } catch (error) {
    //Pausa o processamento e carrega a view enviando os dados que o usuario havua preenchido no formulário
        return res.render("admin/contact/edit-contact", {layout: 'main',profile:req.user.dataValues,  sidebarContactSite: true, data: dataForm, danger_msg: error.errors});
    
    }
    //Editar no BD
    db.Contacts.update(data, { where: { id: data.id} }).then(() =>{
        //Criar a mensagem de usuario editado com sucesso
        req.flash("success_msg", "Contéudo da página contato editado com sucesso!");
        
        //Redirecionar o usuario apos editar
        res.redirect('/contact-site');
        
    }).catch(() =>{
        
        //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
        return res.render('admin/contact/edit-contact', { layout: 'main', profile:req.user.dataValues, data: dataForm, sidebarContactSite: true, danger_msg:"ERRO: Contéudo do topo da contato NÃO editado com sucesso!"});
    });
    
});
//exportar a instrução que está dentro da constante router
module.exports = router;