const Product = require("./models/products")
const Comment = require("./models/comments")
const Category = require("./models/categories")

const { multipleMongooseToObject, mongooseToObject } = require("../util/mongoose");

class layoutController{
  
 //     [GET] /layout/products/
 get_all_products(req,res,next){
   
        Product
            .find({detetedAt:null})
            .then(products => {
                let countArrCate=[], nameArrCate=[]
                if(products!=""){
                    products.forEach(element => {
                        let cateid = 1
                        countArrCate.forEach( number => {
                            if(number==element.category.id){
                                cateid=0
                            }
                        })
                        if(cateid==1){
                            countArrCate.push(element.category.id)
                            nameArrCate.push(element.category.name)
                        }
                    })
                }
                let data = Object.values(products)
                let product_arr =[]
                for (let product of data) {
                    product_arr.push(product)
                }
                res.render('layouts/Products', {
                    products: multipleMongooseToObject(product_arr),countArrCate,nameArrCate
                })
            })
            .catch(next)

    }



 //     [GET] /layout/detail/....
 show_detail(req,res,next){
    console.log("----\nViewer connect: show_detail()")
    let product, productList,commentList
    Product
        .findOne({_id: req.query.key})
            .then(
                products=>{
                    product = products
                }
            )
            // product.category
            .then(()=>{
                Product.find({detetedAt:null, "category.id": product.category.id})
                .then(productsL=>{
                    productList = Object.values(multipleMongooseToObject(productsL));
                })
                .catch((next)=>{
                    console.log('err: Product.find({"category.id": product.category.id}) -> show_detail(req,res,next){');

                    console.log(next);
                })
                .then(()=>{
                    Comment.find({detetedAt:null,id_product: product._id})
                    .then(commentsL=>{
                        commentList = Object.values(multipleMongooseToObject(commentsL))
                        // render->controller->show_detail-------------------------------------------
                        console.log("URL: ../layout/product-detail/?key="+product._id)
                        res.render('layouts/Product_Detail',{ 
                            product,
                            productList,
                            commentList
                         })
      
                    })
                    .catch((next)=>{
                        console.log('err: Product.find({"comment.id_product": product._id}) ->show_detail(req,res,next){');
                        console.log(next);
                    });
                })
            })
            // comments.comment
            .catch((next)=>{
                console.log('err: -> show_detail(req,res,next){');

                console.log(next);
            })
}
    //[POST]
    comment(req, res, next) {
        var add = new Comment(req.body)
        console.log(add)
        add
            .save()
            .then(() => res.redirect("back"))
            .catch((error) => {});
    }

    //[GET] /blog

    get_blog(req,res,next){
        res.render('layouts/Blog')
    }

    //[GET] /blog_detail

    get_blog_detail(req,res,next){
            res.render('layouts/Blog_Detail')
        }

    error(req, res, next){
    res.render('404')
 }

}
module.exports = new layoutController();