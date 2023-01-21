const express=require('express')
const router=express.Router();
const catchAsync=require('../utils/catchAsync')
const Campground=require('../models/Campground')
const {isLoggedin,validateCampground,isAuthor}=require('../middleware')
const campgroundController=require('../controllers/campgroundController')
//multer setup
const multer=require('multer')
const {storage}=require('../cloudinary/index')
const upload=multer({storage})

router.get("/",catchAsync(campgroundController.index))


router.get("/new",isLoggedin,campgroundController.renderNewForm)


router.post("/",isLoggedin,upload.array('image'),validateCampground,catchAsync(campgroundController.createCampground))
// router.post("/",isLoggedin,validateCamground,upload.array('image'),(req,res)=>{
//     console.log(req.body,req.files)
    
//     res.send("it worked")
// })

router.get("/:id",isLoggedin,catchAsync(campgroundController.showCampground))

router.get("/:id/edit",isLoggedin,isAuthor,catchAsync(campgroundController.renderEditForm))

router.put("/:id",isLoggedin,isAuthor,upload.array('image'),validateCampground,catchAsync(campgroundController.updateCampground))

router.delete("/:id",isLoggedin,isAuthor,catchAsync(campgroundController.deleteCampground))

module.exports=router