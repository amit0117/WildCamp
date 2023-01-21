const express=require('express')
const app=express()
const morgan=require('morgan')
app.use(morgan('tiny'))
app.use((req,res,next)=>{
    console.log("this is my first middleware")
    next()
})
app.use((req,res,next)=>{
    console.log("this is my second middleware")
    next()
})

app.get("/",(req,res)=>{
    res.send("this is home page")
})
app.get("/dog",(req,res)=>{
    res.send("this is dogs page")
})
app.listen(3000,()=>{
    console.log("app is listening on port number 3000")
})