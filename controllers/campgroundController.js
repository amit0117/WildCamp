const Campground=require('../models/Campground')
const {cloudinary}=require('../cloudinary')

//mapbox-setup
const mapBoxToken=process.env.MAPBOX_TOKEN
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding")
const geocoder=mbxGeocoding({accessToken:mapBoxToken})



module.exports.index=async(req,res,next)=>{
    const campgrounds=await Campground.find({})
    // console.log(campgrounds)
    res.render("campgrounds/index",{title:"index",campgrounds})
}
module.exports.renderNewForm=(req,res)=>{
    res.render("campgrounds/new",{title:"new"})
}
module.exports.createCampground=async(req,res,next)=>{
   const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    })
    .send()
    // console.log(geoData.body.features[0].geometry.coordinates)
    // return res.send(geoData.body.features[0].geometry.coordinates)

    const newcampground=new Campground(req.body.campground);
    newcampground.geometry=geoData.body.features[0].geometry
    newcampground.images=req.files.map(f=>({url:f.path,filename:f.filename}))
    newcampground.author=req.user.id
    await newcampground.save()
    // console.log(newcampground)
    req.flash('success',"Successfully created a new campground.")
    res.redirect(`/campground/${newcampground._id}`)
    }

module.exports.showCampground=async(req,res,next)=>{
    // console.log('called in campgrouncontroller showcampground ')
    const id=req.params.id
    // console.log("get page !")
    // console.log(`called in campgroundcontrolled showcampground`)
    // console.log(id)
    // const c=await Campground.findById(id)
    // console.log(c.author)
    const camp=await Campground.findById(id).populate({path:'reviews',
    populate:{
        path:'author'
    }
}).populate('author')
if(!camp){
    req.flash("error","Sorry can't find this campground.")
    return res.redirect('/campground')
}

    // console.log(camp)
     res.render("campgrounds/show",{camp,title:"show"})
}
// if(!camp){
//     req.flash('error','This campground doesnot exist anymore');
//     res.redirect('/campground')
// }

module.exports.renderEditForm=async(req,res,next)=>{
    const {id}=req.params
    const campground= await Campground.findById(id)

    // if we can't find that campground
    if(!campground){
        req.flash("error","Can't find that campground!")
        return res.redirect('/campground')
    }
    // authorisation for updating things done by isAuthor middleware
  
    res.render("campgrounds/edit",{campground,title:"edit"})
}

module.exports.updateCampground=async(req,res,next)=>{
    const {id}=req.params
    // authorisation for updating things done by isAuthor middleware
    
    const newcampground= await Campground.findByIdAndUpdate(id,{...req.body.campground});
    
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
    newcampground.images.push(...imgs)

    // deleting images
    if(req.body.deleteImage){
// first delete from cloudinary
        for(let filename of req.body.deleteImage){
            await cloudinary.uploader.destroy(filename)
        }
        
// then from our mongodb
        await newcampground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImage}}}})
    }
    else console.log("empty deleteImage")
    await newcampground.save()
    req.flash('success',"Campground Updated Successfully.")
    res.redirect(`/campground/${newcampground._id}`)
}

module.exports.deleteCampground=async(req,res,next)=>{
    const {id}=req.params
    const camp= await Campground.findById(id)
    // authorisation for deleting things done by isAuthor middleware

    // console.log(req.body)
    await Campground.findByIdAndDelete(id);
    req.flash("success","Successfully Deleted Campground")
    res.redirect("/campground")
}