// model
const Production = require ("./models/products")
// lib
const multer = require("multer")
const md5 = require('md5');
const products = require("./models/products");

// const addressFile = "controllers/FunctionController.js"

const productGetAll = async () =>{
    return await Production.find().exec()
}

const productDetail = async (productID)=>{
    return await Production.findOne({id:productID}).exec()
}

const productSearch = async (req,res,next)=>{
    
}
const productInsert = async (data,count)=>{
    if(data.quatity==1){
        data.product.id= parseInt(count)++
        let newdata = data.product
        await Production.create({newdata})
    }

}
const productUpdate = async (req,res,next)=>{

}
const productDelete = async (req,res,next)=>{

}

class adminFunctionController {
    async productSearch(req,res,nex){
        
    }

}

// module.exports = new FunctionController()

module.exports = {

    productGetAll,
    productDetail,
    productSearch,
    productInsert,
    productUpdate,
    productDelete,

}