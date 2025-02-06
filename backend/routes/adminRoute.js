import express from "express";
import { addDoctor, loginAdmin } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();
adminRouter.post(
  "/add-doctor",
  authAdmin,
  (req, res, next) => {
    console.log("Request received in route");
    next();
  },
  upload.single("image"),
  addDoctor
);
adminRouter.post("/login", loginAdmin);

export default adminRouter;
