const mongoose=require('mongoose');
const schema=mongoose.Schema
const Review=require('./review')


const ImageSchema=new schema({
    url:String,
    filename:String
})



// for loading all image for showing during editing so that we don't 
// have to show full size images 
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})


// used to access virtual property in index.js because by default mongoose does not allow to access the virtual property in 
//https://mongoosejs.com/docs/tutorials/virtuals.html
const opts = { toJSON: { virtuals: true } };

const campgroundschema=new schema({
    title:String,
      geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
      },
    images:[ImageSchema],
    price:Number,
    description:String,
    location:String,
    author:{
        // for owner like to delete kr skta hai ya nhi
        type:schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:'Review'
        }
    ]

},opts)
campgroundschema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campground/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,25)}...</p>`
    // return "i am gettin text"
})
campgroundschema.post('findOneAndDelete',async(doc)=>{
    console.log("deleting")
    if(doc){
        
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports=mongoose.model('Campground',campgroundschema)