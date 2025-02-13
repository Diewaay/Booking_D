import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Tambahkan middleware logging di sini
app.use((req, res, next) => {
  console.log("Headers received:", req.headers);
  next();
});

//middleware
app.use(
  cors({
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(express.json());
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API Working!");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
