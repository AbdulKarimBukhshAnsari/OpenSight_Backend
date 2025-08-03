import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"



const verifyJwt = asyncHandler(async(req , res , next) => {
    try {
        const token = req?.cookies?.accessToken || req?.header("Authorization")?.replace("Bearer " , "") ;
    
        if(!token) {
            throw new ApiError(401 , "Unauthorized Access") ;
        }
    
    
        const decodedToken =  jwt.verify(token , process.env.ACCESS_TOKEN_SECRET) ; 
    
        if(!decodedToken) throw new ApiError(500 , "Can't verify the JWT token") ;
    
        const user = await User.findById(decodedToken?._id) ;
    
        if(user) {
            // saving the data in the req body 
            req.user = user ; 
            next()
        }
        else {
            throw new ApiError(401 , "Unauthorized Access")
        }
    } catch (error) {
        throw new ApiError(501 , error?.message || "Something Went wrong while Verifying the user")
        
    }

})

export default verifyJwt ; 