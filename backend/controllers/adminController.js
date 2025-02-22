import express from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

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
      console.log("Incomplete form data:", req.body);
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }

    if (!validator.isEmail(email)) {
      console.log("Invalid email:", email);
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      console.log("Password too short:", password);
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
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
    console.error("Error saving doctor:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

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
      console.log("Generated token:", token);
      res.json({ success: true, token });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in admin:", error.message);
    res.json({ success: false, message: error.message });
  }
};

const getDoctorsList = async (req, res) => {
  try {
    console.log("Request received in /all-doctors");
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Error getting doctors list:", error.message);
  }
};

// Get all appointments (Admin)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error getting all appointments:", error.message);
    console.error(error.stack); // Log the full error stack for more details
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a doctor
const createDoctor = async (req, res) => {
  try {
    const doctor = new doctorModel(req.body);
    const savedDoctor = await doctor.save();
    res.status(201).json({ success: true, doctor: savedDoctor });
  } catch (error) {
    console.error("Error creating doctor:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a doctor
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDoctor = await doctorModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({ success: true, doctor: updatedDoctor });
  } catch (error) {
    console.error("Error updating doctor:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a doctor
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoctor = await doctorModel.findByIdAndDelete(id);
    if (!deletedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error("Error getting all doctors:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addDoctor, loginAdmin, getDoctorsList, getAllAppointments };
