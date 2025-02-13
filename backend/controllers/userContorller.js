import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Hashing user password
    const hashedPassword = await bcrypt.hash(password, 8);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// API get user profile data
const getUserProfile = async (req, res) => {
  try {
    // Ambil userId yang telah ditambahkan oleh middleware authUser
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, msg: "User ID is required" });
    }

    const userProfile = await userModel.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    res.status(200).json({ success: true, data: userProfile });
  } catch (error) {
    console.error("Error retrieving user profile:", error.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// API update user profile data
const updateUserProfile = async (req, res) => {
  try {
    const { userId, name, email, phone, address, gender } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, msg: "User ID is required" });
    }

    const userProfile = await userModel.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Handle image upload to Cloudinary
    let imageUrl;
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      imageUrl = imageUpload.secure_url;
    }

    // Update profil pengguna
    if (name) userProfile.name = name;
    if (email) userProfile.email = email;
    if (phone) userProfile.phone = phone;
    if (address) userProfile.address = address;
    if (gender) userProfile.gender = gender;
    if (imageUrl) userProfile.image = imageUrl;

    const updatedUserProfile = await userProfile.save();

    res.status(200).json({ success: true, data: updatedUserProfile });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export { registerUser, userLogin, getUserProfile, updateUserProfile };
