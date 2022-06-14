const Product = require("./models/products")
const { multipleMongooseToObject } = require("../util/mongoose");


class siteController {
    // [GET] /
    index(req, res, next) {
        Product
            .find({deletedAt:null})
            .then(products =>{
                // console.log("eeeeeeeeeeeeeeeeeeeeee");
                // console.log(products)
                res.render('main', {
                    products: multipleMongooseToObject(products)
                    })
                }
            )
            .catch(next)

    }

    // [GET] /search
    search(req, res, next) {
        Product
            .find({ deletedAt:null, name: new RegExp(req.query.q, 'i') })
            .then(products => res.render('main', {
                products: multipleMongooseToObject(products)
            }))
            .catch(next)
    }

    error(req, res, next){
       res.render('404')
    }

}

module.exports = new siteController();

 