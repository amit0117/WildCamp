const Campground=require('./models/Campground')
const Review=require('./models/review')
const {campgroundSchema,reviewSchema}=require('./errorSchema')
const ExpressError=require('./utils/ExpressError')
module.exports.isLoggedin= (req,res,next)=>{
    // this isAuntheticated is from passport 
    // console.log(`called in isloggedin middleware`)
    if(!req.isAuthenticated()){
    req.session.returnTo=req.originalUrl
     req.flash("error","You must be Signed in First.")
     return  res.redirect('/login')
    }
    else next()
}
module.exports.validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        // this next is important to working if no error is found
        // because pehle ye middleware chlega tab 
        // (req,res,next) wala chlega
     next()
   }
}
// middleware for checking if he own that post or not
// based on that we can allow then to edit or prevent 
// them from editing or deleting that campground

module.exports.isAuthor=async (req,res,next)=>{
const {id}=req.params
const campground=await Campground.findById(id)
if(!campground.author.equals(req.user._id)){
req.flash("error","You don't have permission to do that.")
return res.redirect(`/campground/${id}`)
}
else next()
}
module.exports.isReviewAuthor=async (req,res,next)=>{
const {id,reviewId}=req.params
const review=await Review.findById(reviewId)
if(!review.author.equals(req.user._id)){
req.flash("error","You don't have permission to do that.")
return res.redirect(`/campground/${id}`)
}
else next()
}
module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else {
        next()
    }
}
