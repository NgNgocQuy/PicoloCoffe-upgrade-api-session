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
                res.redirect('/admin');
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
                else return res.redirect('/admin/loginPage');
            });
        } else
            res.redirect('/admin/loginPage');
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
        let count = await incrementController.incrementSum("product").exec()
        if(await productController.productInsert(req.body,count)){
            await incrementController.updateSum("products",req.body.quatity)
            res.redirect('back')            
        }else
            res.send("something error!")
    }

    async productUpdate(req,res,next){
        let result

        res.json(result)
    }

    async productRemove(req,res,next){
        let result

        res.json(result)
    }

    async productRestore(req,res,next){
        let result

        res.json(result)
    }
    
    async productDelete(req,res,next){
        let result

        res.json(result)
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
    indexOLD(req, res, next) {
        let account, products, categories
        console.log('index');
        if(req.session!= undefined){
            Account
            .findOne({_id: req.session.userId})
                .then(
                    accountObj=>{
                        account = accountObj
                        console.log("Checking session done!");
                            
                    }
                )
            .then(()=>{
            Category.find({})
                .then(category => categories = multipleMongooseToObject(category))
            })
            .then(()=>{
                Product.find({deletedAt:null})
                    .then(productList=>{
                        products = Object.values(multipleMongooseToObject(productList))
                    if (!account) {
                        res.redirect('/admin/login')
                    }
                    else{
                        res.render('admin/index',{products,categories})
                    }
                    
                    })
                    .catch(next)
            })
            .catch(next)
        }else res.render('/admin/login')
    };

//------------------getproducts
    getProducts(req, res, next){
        let account, productsArray,categoriesArray
        console.log('index');
        console.log(req.session.userId);
        Account
        .findOne({_id: req.session.userId})
            .then(
                accountObj=>{
                    account = accountObj
                    console.log("Checking session done!");
                }
            )
        .then(()=>{
        Product.find({deletedAt:null})
        .then(products=>{
            productsArray = Object.values(multipleMongooseToObject(products))
        })
        .then(
            Category.find({})
            .then(categories=>{
                categoriesArray = Object.values(multipleMongooseToObject(categories))
            })
            .then(()=>{
                if (!account) {
                    res.redirect('/admin/login')
                }
                else{
                    res.render('admin/adminAddProducts',{
                        productsArray,
                        categoriesArray
                    })
                }
                
            })
        )
    })
        .catch()
    }

    

    
    // [GET] /admin/login

    
    


    getCategories(req, res, next){
        let account,  categories
        console.log('index');
        console.log(req.session.userId);
        Account
        .findOne({_id: req.session.userId})
            .then(
                accountObj=>{
                    account = accountObj
                    console.log("Checking session done!");
                }
            )
        .then(()=>{
        Category
        .find({deletedAt:null})
        .then(category=>{
            categories = Object.values(multipleMongooseToObject(category))
            if (!account) {
                res.redirect('/admin/login')
            }
            else{
                // console.log(categories);
                res.render('admin/adminCategories',{categories})
            }
           
        })
        .catch(next)

    })
    }

  //[POST] /admin/product------------------------------
  insertProduct(req, res, next) {
    let file = req.file
    if(!file){
        console.log("no image choose or you no premission")
    }
    // console.log(file)
    // console.log(req.body)
    let newId = ""
    let categoryId=""
    let categoryName=""
    Product
        .find({deletedAt:null})
        .then( products=>{
            multipleMongooseToObject(products).forEach(data => {
                if(data.id>newId)
                    newId=(data.id) // products.id
            })
            
            // console.log(newId);
        })
        .then(()=>{
            Category.findOne({id:req.body.categoryId})
            .then((categories)=>{
                categoryId = categories.id  //-> products.categories.id
                console.log(categoryId)
                categoryName = categories.name // -> products.categories.name
                console.log(categoryName)
            })
            .then(()=>{
                console.log("newId > : "+newId)
                var add = new Product({
                    category:{
                        id:categoryId,
                        name:categoryName,
                    },
                    name: req.body.name,
                    vn_name:req.body.vn_name,
                    description: req.body.description,
                    price: req.body.price,
                    image:file.filename,
                    rate:"",
                    id:newId++
                }) //tạo 1 object mới
                add.id = newId // gán 
                console.log(add)
                add
                    .save()
                    .then(() => res.redirect("/admin"))
                    .catch((error) => {});
            })
        })
    .catch(next)
}
// [put] admin/detailProduct
OLDproductDetail(req, res ,next ){
    let account, product,categoriesArray
    console.log('index');
    console.log(req.session.userId);
    Account
    .findOne({_id: req.session.userId})
        .then(
            accountObj=>{
                account = accountObj
                console.log("Checking session done!");
            }
        )
    .then(()=>{
    Product.findOne({deletedAt:null,_id: req.query.key})
        .then(products=>{
            // console.log(products)
                product = products
        })
        .then(()=>{
            Category.find({})
            .then(categories=>{
                categoriesArray = Object.values(multipleMongooseToObject(categories));
            })
            .then(()=>{
                
                if (!account) {
                    res.redirect('/admin/login')
                }
                else{
                    res.render("admin/adminProductsDetail",{
                        product,categoriesArray
                    })
                }
            })
        })

    })
    .catch(next)
}
// 
productUpdate(req, res, next) {
    let file = req.file, imgname
    if(!file){
        imgname = req.body.img_old
        console.log("you not update img")
    }else(
        imgname = file.filename
    )
    // console.log(file)
    // console.log(req.body);
    // console.log(req.body.categoryId);
    let getcate , data
    Category.findOne({id:req.body.categoryId})
        .then((categories)=>{
            getcate = categories
            Product.findOne({ _id: req.body._id })
                .then((pr)=>{
                    data = pr
                    data.category.id = getcate.id
                    data.category.name = getcate.name
                    data.name = req.body.name
                    data.vn_name = req.body.vn_name
                    data.price = req.body.price
                    data.description = req.body.description
                    data.image = imgname
                })
                .then(()=>{
                    // console.log(data)
                    let newdata = new Product(data)
                    data.save()
                    res.redirect("/admin/")
            })
            .catch()
        })
    
}

// [Post] admin/categories---------------------------
insertCategory(req, res, next){
    let newId = 0
    Category
    .find({})
    .then( categories=>{
        multipleMongooseToObject(categories).forEach(data => {
            if(data.id>parseInt(newId))
                newId=parseInt(data.id) // products.id
        })
        
        console.log(newId);
    })
    .then(()=>{
        console.log("newId ->: "+(newId++))
        var add = new Category({
            name:req.body.name,
            vn_name: req.body.vn_name,
            id:newId++
        }) //tạo 1 object mới
        // add.id = newId // gán 
        console.log(add)
        add
        .save()
            .then(() => res.redirect("/admin/categories"))
            .catch((error) => {});
        
    })
    .catch(next)
}

//updateCategory
updateCategory(req,res,next){
    let dataOld, dataNew
    Category.findOne({id: req.body.idUp})
        .then(categories=>{
            if(!categories){
                res.status(400).send({
                    message: 'No data! - you have hacker? - This is an error!'
                })
            }
            else{
                dataNew= categories
                dataOld= categories
                console.log(categories)
                dataNew.name = req.body.nameUp
                dataNew.vn_name = req.body.vn_nameUp
                dataNew.save()
            }
        }).then(()=>{
            res.redirect("/admin/categories")
        }).catch(next)
}
    
    
    

//---newbin

        
            getBin(req, res, next) {
                let account, products, categories
                console.log('index');
                console.log(req.session.userId);
                Account
                .findOne({_id: req.session.userId})
                    .then(
                        accountObj=>{
                            account = accountObj
                            console.log("Checking session done!");
                        }
                    )
                .then(()=>{
                 Category.find({deleted:true})
                    .then(category => categories = multipleMongooseToObject(category))
                })
                .then(()=>{
                    Product.find({deleted:true})
                        .then(productList=>{
                            products = Object.values(multipleMongooseToObject(productList))
                           if (!account) {
                            res.redirect('/admin/login')
                           }
                           else{
                            res.render('admin/recycle_bin',{products, categories})
                           }
                           
                        })
                        .catch(next)
                })
                .catch(next)
            };


    //[DELETE] /admin/delete  ------product
    delete(req,res, next){
     Product.delete({_id:req.params.id})
     .then(()=>res.redirect('/admin/'))
     .catch(next)
    }

  //[DELETE] /admin/delete/:id/force---product
  forceDelete(req, res, next) {
    Product.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('/admin/recycle_bin'))
      .catch(next);
  }
  
   //[PATCH] /admin/product/restore/:id  -----products

   restore(req, res, next) {
    Product.restore({ _id: req.params.id })
      .then(() => res.redirect("/admin/"))
      .catch(next);
  }

  //----------------------------------category---------------------------

    //[DELETE] /admin/category/delete  ------category
    delete_cat(req,res, next){
        Category.delete({_id:req.params.id})
        .then(()=>res.redirect('back'))
        .catch(next)
       }
   
    //---category
     forceDelete_cat(req, res, next) {
        Category.deleteOne({ _id: req.params.id })
         .then(() => res.redirect('back'))
         .catch(next);
     }
     
      // -----cagegory
   
      restore_cat(req, res, next) {
        Category.restore({ _id: req.params.id })
         .then(() => res.redirect("/admin/categories"))
         .catch(next);
     }
 //-------------------------search 
 search(req, res, next) {
    let account, products, categories
    console.log('index');
    console.log(req.session.userId);
    Account
    .findOne({_id: req.session.userId})
        .then(
            accountObj=>{
                account = accountObj
                console.log("Checking session done!");
            }
        )
    .then(()=>{
        // if(req.query.q=="")
        //     res.redirect('/admin')
            
     Category.find({})
        .then(category => categories = multipleMongooseToObject(category))
    })
    .then(()=>{
        Product.find({deletedAt:null,name: new RegExp(req.query.q, 'i')})
        // Product.find({deleted: false ,$or:[ {name:req.query.q}, {vn_name:req.query.q},{price:req.query.q},{"category.name":req.query.q} ] })
            .then(productList=>{
                products = Object.values(multipleMongooseToObject(productList))
               if (!account) {
                   res.redirect('/admin/login')
               }
               else{
                res.render('admin/index',{products,categories})
               }
               
            })
            .catch(next)
    })
    .catch(next)
};



  error(req, res, next){
    res.render('admin/404')
 }

}

module.exports = new adminController();