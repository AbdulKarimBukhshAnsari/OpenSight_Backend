import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    watchHistory : [
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

userSchema.pre('save' , 
    async function(next) {
        if(!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password , 10)
        return next();
    }
)

// injecting few metods with schema

userSchema.methods.isPasswordCorrect = async function  (password) {
    return await  bcrypt.compare(password , this.password);
}

userSchema.methods.generateAccessToken =  function(){
    return jwt.sign(
        {
            _id : this._id , // we will get this from the MongoDB
        },
        process.env.ACESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACESS_TOKEN_EXPIRY
        }
    )

}


userSchema.methods.generateRefreshToken =  function(){
    return jwt.sign(
        {
            _id : this._id , // we will get this from the MongoDB
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}


export const User = mongoose.model('User' , userSchema) ;