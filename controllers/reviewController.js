const Review=require('../models/review')
const Campground=require('../models/Campground')

module.exports.createReview=async(req,res,next)=>{
    const campground=await Campground.findById(req.params.id)
    const review=new Review(req.body.review)
    //make the author of the current review posteby someone
    review.author=req.user._id

    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success","Successfully Created New Review.")
    res.redirect(`/campground/${campground._id}`)
}
module.exports.deleteReview=async(req,res)=>{
    // res.send("deleting the reviews")
    const {id,reviewId}=req.params
    // $ pull is used to pull out or delete some particular
    // value from some array based on id
    // here we pull the item from reviews array of campground
    // having id=reviewId
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review Deleted Successfully")
    res.redirect(`/campground/${id}`)
    }