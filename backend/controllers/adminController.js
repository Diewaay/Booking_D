import express from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";

const addDoctor = async (req, res) => {
  console.log("Incoming request body:", req.body);
  console.log("Uploaded file:", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    console.log("Data received:", {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    });

    // Check all form data
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      console.log("Incomplete form data:", req.body); // Tambahkan log ini
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }

    // Check if email is valid
    if (!validator.isEmail(email)) {
      console.log("Invalid email:", email); // Tambahkan log ini
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // Check if password is valid
    if (password.length < 8) {
      console.log("Password too short:", password); // Tambahkan log ini
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address); // Parse string JSON into object
    } catch (error) {
      console.log("Error parsing address:", error.message);
      return res
        .status(400)
        .json({ success: false, message: "Invalid address format" });
    }

    console.log("Parsed address:", parsedAddress);

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res
      .status(201)
      .json({ success: true, message: "Doctor created successfully" });
  } catch (error) {
    console.error("Error saving doctor:", error.message); // Log the specific error message
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// API admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ success: true, token });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in admin:", error.message); // Log the specific error message
    res.json({ success: false, message: error.message });
  }
};

export { addDoctor, loginAdmin };
