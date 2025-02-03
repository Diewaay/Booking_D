import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js"; // Ensure the correct import with .js extension
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middleware
app.use(cors());
app.use(express.json());

//api endpoint
app.use("/api/admin", adminRouter); // localhost:4000/api/admin/ad-doctor

app.get("/", (req, res) => {
  res.send("API Working!");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
