const express = require('express')
const router = express.Router()

const layoutController = require('../controllers/layoutController')

router.get('/product-detail?:key', layoutController.show_detail)
router.post('/product-detail?:key', layoutController.comment)
router.get('/products', layoutController.get_all_products)
router.get('/blog',layoutController.get_blog)
router.get('/blog-detail',layoutController.get_blog_detail)
router.get('/:slug', layoutController.error)




module.exports = router