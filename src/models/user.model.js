import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : {
        type : String ,
        required : true , 
        trim : true , 
        index : true , 
        unique : true , 
        lowercase : true 
    },
    email : {
        type : String ,
        required : true , 
        trim : true ,  
        unique : true , 
        lowercase : true 
    },
    fullName : {
        type : String ,
        required : true , 
        trim : true ,   
        index: true  
    },
    avatar : {
        type : String,
        required : true 
    },
    coverImage : {
        type : String 
    },
    watchHistor : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "Video"
        }
    ],
    password : {
        type : String , 
        trim : true , 
        unique : true ,
        required : [true , "Password is Required"]
    },
    refreshToken : {
        type : String 
    }
} , {timestamps : true}) ;

export const User = mongoose.model('User' , userSchema) ;