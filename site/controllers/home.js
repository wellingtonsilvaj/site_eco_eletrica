//incluir as bibliotecas
//Gerencia as requisições, rotas e URLs, entre outra funcionalidades
const express = require('express');
//Utilizado para manipular as rotas da aplicação
const router = express.Router();
//Incluir o arquivo que possui conexão com o BD
const db = require('./../db/models');

//Criar a rota da pagina inicial
router.get("/", async (req, res) => {
    
    //Recuperar registros do BD Tabela HomesTops
    var homeTop = await db.HomesTops.findOne({
        //Indicar quais colunas recuperar           
        attributes: ['titleOneTop', 'titleTwoTop', 'titleThreeTop', 'linkBtnTop', 'txtBtnTop', 'imageTop']
    });

    //Se encontrar o registro no BD, cria o caminho da imagem
    if(homeTop){
        homeTop.dataValues['imageTop'] = process.env.URL_ADM + "/images/home_top/" + homeTop.dataValues['imageTop'];

    }
  
    //Recuperar registros do BD tabela HomesServices
    const homeService = await db.HomesServices.findOne({
        //Indicar quais colunas recuperar
        attributes:['titleService', 'iconOne', 'iconTwo', 'iconThree', 'titleOneService', 'titleTwoService', 'titleThreeService', 'descOneService', 'descTwoService', 'descThreeService']
    });

    //Recuperar registros do BD tabela HomesPremiums
    var homePremium = await db.HomesPremiums.findOne({
        //Indicar quais colunas recuperar
        attributes:['premTitle', 'premSubtitle', 'premDesc', 'premBtn_text', 'premBtn_link', 'premImage']
    });
    //Se encontrar o registro no BD, cria o caminho da imagem
    if(homePremium){
        homePremium.dataValues['premImage'] = process.env.URL_ADM + "/images/home_prem/" + homePremium.dataValues['premImage'];
    }

    //recuperar o registro do BD
    const footer = await db.Footers.findOne({
        //Indicar quais colunas recuperar
        attributes: ['footerDesc', 'footerTextLink', 'footerLink']
    });
    
    //Pausar o processamento, carregar a view, carregar o layout main
    res.render("site/home", { layout: 'main', footer: footer.dataValues, homeTop: homeTop.dataValues, homeService: homeService.dataValues, homePremium: homePremium.dataValues });

});


//Exportar a instrução que está dentro da constante router
module.exports = router;