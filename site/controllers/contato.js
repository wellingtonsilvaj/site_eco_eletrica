//incluir as bibliotecas
//Gerencia as requisições, rotas e URLs, entre outra funcionalidades
const express = require('express');
//Utilizado para manipular as rotas da aplicação
const router = express.Router();
//Incluir o arquivo que possui conexão com o BD
const db = require('./../db/models');
//Validar input no formulário
const yup = require('yup');

//Criar a rota da pagina inicial
router.get("/", async (req, res) =>{

    //Recuperar o registro do BD
    const contact = await db.Contacts.findOne({
        //Indicar quais colunas recuperar da tabela contacts
        attributes: ['titleContact', 'SubTitleContact', 'iconCompany', 'titleCompany', 'descCompany', 'iconAddress', 'titleAdress', 'descAddress', 'iconEmail', 'titleEmail', 'descEmail', 'titleForm']
    });

    
    //Pausar o processamento, carregar a view, carregar o layout main
    res.render("site/contato", { layout: 'main', contact: contact.dataValues });

});

//Criar a rota para receber os dados do formulario cadastrar contato
router.post('/', async (req, res) => {
    //Receber os dados do formulário
    var data = req.body;
    

    //Enviar dados para o formulário
    var dataForm = req.body;
    
    //Recuperar o registro do BD
    const contact = await db.Contacts.findOne({
        //Indicar quais colunas recuperar da tabela contacts
        attributes: ['titleContact', 'SubTitleContact', 'iconCompany', 'titleCompany', 'descCompany', 'iconAddress', 'titleAdress', 'descAddress', 'iconEmail', 'titleEmail', 'descEmail', 'titleForm']
    });

    //recuperar o registro do BD
    const footer = await db.Footers.findOne({
        //Indicar quais colunas recuperar
        attributes: ['footerDesc', 'footerTextLink', 'footerLink']
    });

    //Validar campos utilizando o yup
    const schema = yup.object().shape({
    content: yup.string("Erro: necessário preencher o campo conteúdo!")
        .required("Erro: necessário preencher o campo conteúdo!"),
    subject: yup.string("Erro: necessário preencher o campo Assunto!")
        .required("Erro: necessário preencher o campo Assunto!"),
    email: yup.string("Erro: necessário preencher o campo E-mail!")
        .required("Erro: necessário preencher o campo E-mail!")
        .email("Erro: Necessário preencher um e-mail válido!"),
    name: yup.string("Erro: necessário preencher o campo nome!")
        .required("Erro: necessário preencher o campo nome!"),
    });

    //Verificar se todos os campos passaram pela validação
    try {
        await schema.validate(data);
    } catch (error) {
        //Pausar o processamento e carregar a view enviando os dados que o suario havia preenchido no formulario
        return res.render("site/contato", {layout: 'main', footer: footer.dataValues, contact: contact.dataValues, data: dataForm, danger_msg: error.errors });
    }

    db.ContactsMsgs.create(data).then(() => {
        // console.log("Mensagem enviada com sucesso!");

        //Pausar o processamento e carregar a view enviando os dados que o suario havia preenchido no formulario
        return res.render("site/contato", {layout: 'main', footer: footer.dataValues, contact: contact.dataValues, success_msg:"Mensagem enviada com sucesso!"});

    }).catch(() => {
        console.log("Erro: Mensagem não enviada  com sucesso!");
        
        //Pausar o processamento e carregar a view enviando os dados que o suario havia preenchido no formulario
        return res.render("site/contato", {layout: 'main', footer: footer.dataValues, contact: contact.dataValues, data: dataForm, danger_msg:"Mensagem não enviada com sucesso!"});

    });
});

//Exportar a instrução que está dentro da constante router
module.exports = router;