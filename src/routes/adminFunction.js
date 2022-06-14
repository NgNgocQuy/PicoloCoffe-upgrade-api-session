const expess = require("express")
const adminFunction = expess.Router()
const store = require("../util/multer")
const adminController = require('../controllers/adminController')


adminFunction.use("/test",(req,res,next)=>{console.log("admin function test"); next()})
adminFunction.get("/test/test2", (req,res,next)=>{console.log("admin test2"); next()})

// admin function api
    // product
    adminFunction.get("/product/productDetail", (req,res,next)=>{next()},adminController.productDetail)
    adminFunction.get("product/search", adminController.productSearch)
    adminFunction.post("product/insert", adminController.productInsert)
    adminFunction.put("product/update", adminController.productUpdate)
    adminFunction.delete('product/remove',adminController.productRemove)
    adminFunction.delete('product/delete',adminController.productDelete)
    adminFunction.patch('product/restore',adminController.productRestore)

    // category
    // adminFunction.delete('/delete/category/:id',adminController.delete_cat)
    // adminFunction.delete('/delete/category/:id/force',adminController.forceDelete_cat)
    // adminFunction.patch('/restore/category/:id',adminController.restore_cat)

// get collection
// adminFunction.get("/product", adminController.product)
adminFunction.get('/categories', adminController.categories)
adminFunction.get('/recycle_bin', adminController.getBin)
adminFunction.get('/', adminController.index)




// adminFunction.get('/insert', adminController.waitInsert)
adminFunction.post('/insert', store.single('image'),adminController.insertProduct)
// adminFunction.post('/insertCategories', adminController.insertCategory)
// product property upadte.. 
// adminFunction.get('/products/?:productDetail',adminController.productDetail)

    // query
    adminFunction.get('/productDetail?:key',adminController.productDetail)
    adminFunction.put('/productUpdate',store.single('image'),adminController.productUpdate)
    adminFunction.get('/search', adminController.search)
    adminFunction.post("/categoryInsert",adminController.insertCategory)
    adminFunction.put("/categoryUpdate",adminController.updateCategory)
    adminFunction.get('/:slug', adminController.error)

module.exports = adminFunction;