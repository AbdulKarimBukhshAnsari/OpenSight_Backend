import { Router } from "express";
import { logoutUser, registerUser , loginUser, getAccessToken, changeCurrentPassword, getCurrentUser } from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },  
  ]),
  registerUser
);


userRouter.route("/login").post(loginUser) ;

// secured Routes 
userRouter.route("/logout").post(verifyJwt , logoutUser) ;
userRouter.route("/getAccessToken").post(getAccessToken) ;
userRouter.route("/changeCurrentPassword").post(verifyJwt , changeCurrentPassword) ; 
userRouter.route("/getCurrentUser").get(verifyJwt , getCurrentUser);

export default userRouter;
