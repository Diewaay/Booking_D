import express from "express";
import {
  getUserProfile,
  registerUser,
  updateUserProfile,
  userLogin,
} from "../controllers/userContorller.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", userLogin);

userRouter.get("/get-profile", authUser, getUserProfile);
userRouter.put(
  "/update-profile",
  authUser,
  upload.single("imageFile"),
  updateUserProfile
);

export default userRouter;
