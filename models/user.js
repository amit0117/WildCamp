const mongoose=require('mongoose')
const passportLocalSchema=require('passport-local-mongoose')
const Schema=mongoose.Schema

const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

UserSchema.plugin(passportLocalSchema)
module.exports=mongoose.model('User',UserSchema)