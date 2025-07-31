import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    if (!refreshToken || !accessToken)
      throw new ApiError(
        502,
        "Something went wrong while generating the Tokens"
      );
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // returning the Access Token and Refresh Token
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something Went wrong While Generating the token");
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  // get the data coming from the frontend and do validation that user has provided the data
  const { email, password, fullName, userName } = req.body;
  console.log("Request Body", req.body);

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

  // getting the image file from the Multer

  const avatarLocalPath = req?.files?.avatar?.[0]?.path;
  console.log("Avatar Local Path", avatarLocalPath);
  const coverImageLocalPath = req?.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar Is Required");

  // upload the files On Cloudinary
  const avatarUrl = (await uploadOnCloudinary(avatarLocalPath))?.url;
  const coverImageUrl =
    (await uploadOnCloudinary(coverImageLocalPath))?.url || "";

  //  If we face in error while uploading the file of the avatar
  if (!avatarUrl) throw new ApiError(501, "Error in uploading the Avatar");
  console.log("Avatar has been uplaoded");

  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    password,
    fullName,
    coverImage: coverImageUrl,
    avatar: avatarUrl,
  });

  // remove the password and refresh token.
  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );
  if (!createdUser)
    throw new ApiError(
      501,
      "Something Went Wrong , User Could not created Successfully"
    );

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Created Successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  // get the data
  const { email, password, userName } = req.body;

  console.log("Request Body ", req.body);
  if (
    [email, password, userName].some(
      (element) => element?.trim() === "" || !element
    )
  ) {
    throw new ApiError(401, "All Fields Are Required");
  }
  const user = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (!user)
    throw new ApiError(
      406,
      "User does  not Exist , kindly make your account first"
    );

  const isPasswordCorrect = user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(407, "Incorrect Credentials");

  // getting the Access Token and Refresh Tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // getting the user with the Access token
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // setting the option for cookie
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        200,
        "Successfully logged in the user "
      )
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {});

export { registerUser, loginUser };
