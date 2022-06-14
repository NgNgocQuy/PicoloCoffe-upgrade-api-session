const express = require('express')
const router = express.Router()
const store = require("../util/multer")
const adminFunction = require('./adminFunction')
const adminController = require('../controllers/adminController')
const session = require('../controllers/accountController')

// login
router.get("/debuglog", adminController.debuglog)
router.get('/loginPage', adminController.showlogin)
router.post('/login',adminController.login)
// logout
router.get('/logout', adminController.logout)

// function
router.use("/", session.authenticate,adminFunction)

module.exports = router