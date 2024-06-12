//incluir as bibliotecas
//Gerencia as requisições, rotas e URLs, entre outra funcionalidades
const express = require('express');
//Utilizado para manipular as rotas da aplicação
const router = express.Router();
//Incluir o arquivo que possui a conexão com o BD
const db = require('./../db/models');


//Criar a rota da pagina inicial
router.get("/", async (req, res) => {
    
    const aboutsCompanies = await db.AboutsCompanies.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','titleAboutsCompanies', 'descAboutsCompanies',
        //concatenar o endereço do adm e o nome da image
        [db.sequelize.fn('CONCAT', process.env.URL_ADM + "/images/about/", db.sequelize.col('imageAboutsCompanies') ),
        'imageAboutsCompanies'],],
        //Ordenar os registros pela coluna id na forma decrescente
        order:[['id', 'DESC']],
        //Acrescentando condição para indicar qual registro deve ser retornado do BD
        where: { situationAboutId: 1}
    });
    
    //recuperar o registro do BD
    const footer = await db.Footers.findOne({
        //Indicar quais colunas recuperar
        attributes: ['footerDesc', 'footerTextLink', 'footerLink']
    });

    //Pausar o processamento, carregar a view, carregar o layout main
    res.render("site/sobre", { layout: 'main', footer: footer.dataValues, aboutsCompanies: aboutsCompanies.map( id => id.toJSON()) });

});


//Exportar a instrução que está dentro da constante router
module.exports = router;