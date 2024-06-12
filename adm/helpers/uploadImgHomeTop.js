//Multer é um middleware node.js para manipulação multipart/form-data, usado para o upload de arquivos
const multer = require('multer');

//O módulo path permite interagir com o sistema de arquivo
const path = require('path');

//Realizar upload de usuario
module.exports = (multer({
    //diskStorage permite manipular local para salvar imagem
    storage: multer.diskStorage({
        //Local para salvar a imagem
        destination: (req, file, cb) => {
            console.log(file);
            cb(null, './public/images/home_top');
        },
        filename: function (req, file, cb){
          // console.log(Date.now().toString() + req.user.dataValues.id + path.extname(file.originalname));
            cb(null, Date.now().toString() + req.user.dataValues.id + path.extname(file.originalname));
        }
    }),
    //Validar a extensão do arquivo
    fileFilter: (req, file, cb) => {
        //Verficar se a extensão da imagem enviada pelo usuário no array de extensões
        const extensaoImg = ['image/jpeg', 'image/jpg', 'image/png'].find(formatoAceito => formatoAceito == file.mimetype);

        //Retornar TRUE quando a extensão da imagem é valida
        if(extensaoImg){
            return cb(null, true);
        }
            return cb(null, false);
    }
}));