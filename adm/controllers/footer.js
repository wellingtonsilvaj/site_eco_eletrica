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
    
    //Recuperar registros no BD
    const footer = await db.Footers.findOne({
        //Indicar quais colunas recuperar
        attributes: ['footerDesc', 'footerTextLink', 'footerLink', 'createdAt', 'updatedAt']
    });

    //Acessa o IF se encontrar o registro no BD
    if(footer){
        res.render("admin/footer/view", {layout: 'main', profile:req.user.dataValues, sidebarFooterSite: true, footer});

    }else{
        //Criar Mensagem de ERRO
        req.flash("danger_msg", "Erro: Nenhum conteúdo do Rodapé encontrando");
        
        //Redireciona se não encontrar
        res.redirect('/dashboard')
    }
    
});

//Criar a rota para pág com formulário editar conteudo do roda-pé
router.get('/edit', eAdmin, async (req, res) => {

     //Recuperar registros no BD
     const footer = await db.Footers.findOne({
        //Indicar quais colunas recuperar
        attributes: ['id','footerDesc', 'footerTextLink', 'footerLink']
    });

    
    //Acessa o IF se encontrar o registro no BD
    if(footer){
        var dataForm = footer.dataValues;

        res.render("admin/footer/edit", {layout: 'main', profile:req.user.dataValues,data:dataForm, sidebarFooterSite: true});

    }else{
        //Criar Mensagem de ERRO
        req.flash("danger_msg", "Erro: Nenhum conteúdo do Rodapé encontrando");
        
        //Redireciona se não encontrar
        res.redirect('/dashboard')
    }
    

});

//Criar a rota para pág com formulário editar conteudo do topo da pagina home
router.post('/edit', eAdmin, async (req, res) =>{

    //Receber dados do formulário
    var data = req.body;
    
    //Inicio enviar dados para formulario
    //Enviar dados para o formulário
    var dataForm = req.body;

     //Validar se o usuario preencheu todos os campos
     const schema = yup.object().shape({
        id:yup.string("Erro: Preenchimento incorreto do formulário!")
            .required("Erro:Preenchimento incorreto do formulário!"),
        footerLink: yup.string("Erro: Necessário preencher o campo Link do rodapé!")
            .required("Erro: Necessário preencher o campo Link do rodapé!"),
        footerTextLink: yup.string("Erro: Necessário preencher o campo texto do link rodapé")
            .required("Erro: Necessário preencher o campo texto do link rodapé!"),
        footerDesc: yup.string("Erro: Necessário preencher o campo título do rodapé!")
            .required("Erro: Necessário preencher o campo título do rodapé!"),
          
        });
        // Verificar se todos os campos passaram pela validação
        try {
            await schema.validate(data);
        } catch (error) {
        //Pausa o processamento e carrega a view enviando os dados que o usuario havua preenchido no formulário
            return res.render("admin/footer/edit", {layout: 'main',profile:req.user.dataValues,  sidebarFooterSite: true, data: dataForm, danger_msg: error.errors});
        
        }
    //Editar no BD
    db.Footers.update(data, { where: { id: data.id} }).then(() =>{
        //Criar a mensagem de usuario editado com sucesso
        req.flash("success_msg", "Rodapé da página editado com sucesso!");
        
        //Redirecionar o usuario apos editar
        res.redirect('/footer-site');
        
    }).catch(() =>{
        
        //Pausar processamento e carregar view, carregat o layout main, indicar qual item deve ficar ativo
        return res.render('admin/footer/edit', { layout: 'main', profile:req.user.dataValues, data: dataForm, sidebarFooterSite: true, danger_msg:"ERRO: Contéudo do rodapé da página NÃO editado com sucesso!"});
    });
});
//exportar a instrução que está dentro da constante router
module.exports = router;