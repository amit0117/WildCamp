const express=require('express');
const mongoose=require('mongoose')
const catchAsync=require('./utils/catchAsync')
var expressLayouts = require('express-ejs-layouts');
const path =require('path')
const Joi =require('joi');
const ExpressError=require('./utils/ExpressError')
const Campground=require('./models/Campground')
const methodOverride=require('method-override')
mongoose.connect("mongodb://localhost:27017/yelp-camp"
)
const db=mongoose.connection
db.on("error",console.error.bind(console,"connection error"))

db.once("open",()=>{
    console.log("database connection established")
})

const app=express();
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.set('layout','./layouts/layout')
app.use(expressLayouts)
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride('_method'))


app.get('/check',(req,res)=>{
    res.render("campgrounds/new",{title:"new"})

})
app.post('/campground',(req,res)=>{
    const schema=Joi.object({
        campground:Joi.object({
            title:Joi.string().min(3).max(30).required(),
            price:Joi.number().min(0).required(),
            location:Joi.string().required
        }).required(),

    })
    const result=schema.validate(req.body)
    if(result){
        res.send(result.error.message)
    }
    res.send("sb shi hai")
})
app.listen(3000,()=>{
    console.log("app is listening on port number 3000")
})