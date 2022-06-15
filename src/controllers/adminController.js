const Product = require("./models/products")
const fs = require('fs');
const md5 = require('md5');
const Account = require("./models/account")
const Category = require("./models/categories")
const { multipleMongooseToObject } = require("../util/mongoose");
const { mongooseToObject } = require("../util/mongoose")
const mongoose = require("mongoose");

const incrementController = require("./incrementController")

const productController = require("./productController")

const accountController = require("./accountController")

const categoryController = require("./categoryController")

const multer = require("multer");
const { render } = require("ejs");

const loger = {
    debug:"off",
    description:"off",
    
}

class adminController {

    async debuglog(req,res,next){
        console.log("debug log: "+ req.query.debug);
        loger.debug = req.query.debug
        next()
    }

    async showlogin(req,res,next){
        res.render('admin/loginPage',{message:"Well come to Admin! If you are my crush,you can Login :))))"})
    }

    async login(req, res, next) {
        console.log(req.body);
        let newSessionKey = md5((new Date()).getTime())
        try {
            if(accountController.updateSessionKey(req.body.username,req.body.password,newSessionKey)){
                console.log(req.body.username+", session: "+newSessionKey);
                req.session.username = req.body.username
                req.session.sessionKey = newSessionKey
                res.redirect('/');
            }else{
                // console.log("fail login:"+ req.body);
                res.render("/admin/loginPage",{message:"username or password incorrect!"})
            }
        
        } catch (error) {
            console.log(error);
            res.render("/admin/loginPage",{message:"something wrong ??"})
        }
    }

    async logout(req, res, next) {
        if (req.session) {
            // delete session object
            req.session.destroy(function (err) {
                if (err) return next(err)
                else return res.redirect('/loginPage');
            });
        } else
            res.redirect('/loginPage');
    };
    
    async index(req,res,next){
        if(loger.debug == "on") console.log("Username : "+req.session.username);
        let products = await productController.productGetAll()
        let categories = await categoryController.categoryGetAll()
        res.render('admin/index',{products,categories})
    }

// API function
    async productDetail(req,res,next){
        let productDetail = await productController.productDetail(req.query.id)
        let categoryDetail = await categoryController.categoryDetail(productDetail.category.id)
        let result = {
            productDetail,
            categoryDetail
        }

        res.render("admin/adminProductsDetail",{result})
    }
    async productSearch(req,res,next){
        let result

        res.json(result)
    }

    async productInsert(req,res,next){
        let count = await incrementController.incrementSum("product")
        if(await productController.productInsert(req.body,count)){
            await incrementController.updateSum("products",req.body.quatity)
            res.redirect('back')            
        }else
            res.send("something error!")
    }

    async productUpdate(req,res,next){ //post
        res.json(await productController.productUpdate({id:req.body.id}, req.body))
    }

    async productRestore(req,res,next){
        res.json(await productController.productUpdate({id: req.body.id}, {deleted:"false"} )) // deleted: "true"
    }
    
    async productDelete(req,res,next){
        res.json(await productController.productUpdate({id: req.body.id}, {deleted:"true"} )) // deleted: "true"
    }






// -------------------------------------------------------------------------------------------

    async categories(req,res,next){
        let result

        res.json(result)
    }

    async getBin(req,res,next){
        let result

        res.json(result)
    }

    // -------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------
    // [GET] /admin/



  error(req, res, next){
    res.render('admin/404')
 }

}

module.exports = new adminController();