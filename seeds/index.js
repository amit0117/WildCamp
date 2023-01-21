const mongoose=require('mongoose')
const cities=require("./cities")
const {places,descriptors}=require("./seedHelper")
const Campground=require('../models/Campground')
const mongo_url=process.env.MONGO_URI
// mongoose.connect("mongodb://localhost:27017/yelp-camp")
mongoose.connect(mongo_url)
mongoose.set('strictQuery', true)
const db=mongoose.connection
db.on("error",console.error.bind(console,"ERROR IN CONNECTING MONGO DATABASE"))

db.once("open",()=>{
    console.log("database connection established")
})

const sample=(arr)=>arr[Math.floor(Math.random()*arr.length)]
const seedDb=async()=>{
    await Campground.deleteMany({})
   
    for(let i=0;i<400;++i){
        const random1000=Math.floor(Math.random()*200)
        const randomprice=Math.floor(Math.random()*30)+Math.floor(Math.random()*10)
        const newcamp=new Campground({
        title:`${sample(descriptors)} ${sample(places)}`,
        location:`${cities[random1000].city} ${cities[random1000].state}`,
        description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quae, culpa, obcaecati veniam nisi dolorum fugit, autem optio fuga expedita consequatur qui dolore! Voluptas dolorum reprehenderit porro iusto consectetur quisquam?",
        price:randomprice,
        // currently this i have same save same for all campground object for testing
        author:'63cbc66cf96eb17e02187f47',
        // 63cbc66cf96eb17e02187f47
        images:[
            { 
                url: 'https://res.cloudinary.com/dhh7rfflz/image/upload/v1671091129/YelpCamp/xap3rmu6xvcdpl8mjqj3.jpg',  
                filename: 'YelpCamp/xap3rmu6xvcdpl8mjqj3'
             
              }
        ],
        geometry:{
          type:'Point',
          coordinates:[
            cities[random1000].longitude,
            cities[random1000].latitude
          ]
        }
        })
        await newcamp.save()
    }
}
seedDb().then(() =>{
    mongoose.connection.close()
})

