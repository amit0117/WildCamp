const User=require('../models/user')

module.exports.renderRegister=(req,res)=>{
    // console.log("register get page ")
    res.render("users/register",{title:"register"})
}
module.exports.register=async(req,res,next)=>{
    try{
    const {email,username,password}=req.body
    const newUser=new User({email,username})
    const registeredUser= await User.register(newUser,password)
    // console.log(registeredUser)

    //for making a user login after registering them
    // using req.login method of passport as in case of logout
    req.login(registeredUser,err=>{
        if(err) return next(err)
        else{
        req.flash("success","Welcome to Yelp-Camp")
        res.redirect('/campground')
        }
    })
    }
    catch(err){
        req.flash("error",err.message)
        res.redirect('/register')
    }
}

module.exports.rednerLogin=(req,res)=>{
    res.render('users/login',{title:"login"})
}
module.exports.Login=(req,res)=>{
    // means yha tk aa gya hai to successfully authenticated user hai
    req.flash("success",`Welcome back, ${req.body.username}`)
    
    //if user koi aur route pe jana chahta hai but o login nhi hai
    // hai to after login use whi route pe bhej denge
    const redirectUrl=req.session.returnTo||'/campground'
    delete req.session.returnTo
    res.redirect(redirectUrl)
    }
    module.exports.Logout=(req,res,next)=>{
        req.logout(function(err) {
            if (err) { 
                return next(err);
            }
         else{
          req.flash("success","Logged you out!")
          res.redirect('/campground');
         }
          });   
    }