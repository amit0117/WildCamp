const express=require('express')
// this mergeparams is used because if we use 
// router then we can't get id which we supposed to get
// so when we try to submit a review then we can't able to submit
// it because in post route of review we have to access the id of that campground
// but we have not access of it so for accessing params in app of
// curr route we have to specify 'mergeparams:true'
const router=express.Router({mergeParams:true})
const Review=require('../models/review')
const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')
const Campground=require('../models/Campground')
const {reviewSchema}=require('../errorSchema')
const {validateReview,isLoggedin,isReviewAuthor}=require('../middleware')

const reviewController=require('../controllers/reviewController')

router.post('/',isLoggedin,validateReview,catchAsync(reviewController.createReview))

router.delete('/:reviewId',isLoggedin,isReviewAuthor,catchAsync(reviewController.deleteReview))

module.exports=router