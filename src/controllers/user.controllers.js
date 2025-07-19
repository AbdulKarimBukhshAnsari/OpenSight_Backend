import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const registerUser = asyncHandler(async (req , res , next) => {
    // get the data coming from the frontend and do validation 
    const {email , password ,  fullName , userName } = req.body ;
    if([email, password , fullName  , userName].some((element)=> element?.trim() === "") || 
    [email , password , fullName , userName].some((element) => !element)) {
       throw new ApiError(400 , "All Fields are Required");
    }
})

export {registerUser}