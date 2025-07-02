import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema( {
    videoFile : {
        type : String ,
    },
    thumbnail : {
        type : String 
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User"
    },
    title : {
        type : String ,
        trim : true , 
        required : [true , "Title is Required"]
    },
    description : {
        type : String , 
        trim : true , 
        required : [true , "Title is Required"]
    },
    duration : {
        type : Number ,
    },
    views : {
        type : Number ,
    },
    isPublished : {
        type : Boolean ,
    }
} , {timestamps : true})


videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video' , videoSchema) ;