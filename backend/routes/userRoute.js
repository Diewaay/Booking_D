import express from "express";
import {
  getUserProfile,
  registerUser,
  updateUserProfile,
  userLogin,
  bookAppointment,
  getUserAppointments,
  updateAppointment,
  cancelAppointment,
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

userRouter.post("/book-appointment", authUser, bookAppointment);

// Route for fetching user's appointments
userRouter.get("/appointments/:userId", authUser, getUserAppointments);

// Route for updating an appointment
userRouter.put("/appointment/:_id", authUser, updateAppointment);

// Route for cancelling an appointment
userRouter.delete("/appointment/:_id", authUser, cancelAppointment);

export default userRouter;
