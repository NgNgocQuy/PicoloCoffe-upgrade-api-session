const multer = require('multer');

// set storage
var storage = multer.diskStorage({
    destination : function ( req , file , cb ){
        cb(null,"src/public/img")
    },
    filename : function (req, file , cb){
        // image.jpg
        // var ext = file.originalname.substr(file.originalname.lastIndexOf('.'));

        cb(null,  Date.now() +"-"+ file.originalname)
    }
})

module.exports = store = multer({ storage : storage })

// copyright: https://github.com/akashyap2013/Image_Uploader_NodeExpress