import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res, next) => {
  // get the data coming from the frontend and do validation that user has provided the data
  const { email , password, fullName, userName } = req.body;
   console.log("Request Body" , req.body)

  if (
    [email, password, fullName, userName].some(
      (element) => element?.trim() === "" || !element
    )
  ) {
    throw new ApiError(401, "All Fields are Required");
  }
   

  // checking if the user Already Exists
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) throw new ApiError(402, "User Name or Email Already Exists");

  // getting the image filr from the Multer


  const avatarLocalPath = req?.files?.avatar[0]?.path;
  const coverImageLocalPath = req?.files?.coverImage[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar Is Required");

  // upload the files On Cloudinary
  const { url: avatarUrl } = await uploadOnCloudinary(avatarLocalPath);
  const { url: coverImageUrl = ""} = await uploadOnCloudinary(coverImageLocalPath);

  //  If we face in error while uploading the file of the avatar
  if (!avatarUrl) throw new ApiError(501, "Error in uploading the Avatar");

  const user = await User.create({
    userName : userName.toLowerCase() ,
    email , 
    password , 
    fullName , 
    coverImage : coverImageUrl ,
    avatar : avatarUrl
  });

  // remove the password and refresh token.
  const createdUser = await User.findById(user?._id).select("-password -refreshToken");
  if(!createdUser) throw new ApiError(501 , "Something Went Wrong , User Could not created Successfully") ;

  return res.status(201).json(
    new ApiResponse(200 , createdUser , 'User Created Successfully' )
  )

});

export { registerUser };
