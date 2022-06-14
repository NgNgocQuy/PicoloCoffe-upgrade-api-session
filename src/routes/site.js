const express = require('express')
const router = express.Router()

const siteConstroller = require('../controllers/siteController')
router.get('/search', siteConstroller.search)
router.get('/', siteConstroller.index)
router.get('/:slug', siteConstroller.error)

module.exports = router