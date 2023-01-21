const express=require('express')
const passport = require('passport')
const router=express.Router()
const User=require('../models/user')
const catchAsync=require('../utils/catchAsync')
const userController=require('../controllers/userController')

router.get('/register',userController.renderRegister)

router.post('/register',catchAsync(userController.register))

router.get('/login',userController.rednerLogin)
// here use the passport middleware  here we use strategy as local means use 
// username and password to authenticate 
// but we may have different route for authenticate using google
router.post('/login',passport.authenticate("local",{failureFlash:true,failureRedirect:'/login'}),userController.Login) 



router.get('/logout',userController.Logout)

module.exports=router