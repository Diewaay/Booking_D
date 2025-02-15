import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

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

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    if (!userId || !docId || !slotDate || !slotTime) {
      return res
        .status(400)
        .json({ success: false, msg: "All fields are required" });
    }

    // Mendapatkan data dokter
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData) {
      return res.status(404).json({ success: false, msg: "Doctor not found" });
    }

    if (!docData.available) {
      return res
        .status(400)
        .json({ success: false, msg: "Doctor is not available" });
    }

    // Pastikan slots_booked adalah array
    let slots_booked = Array.isArray(docData.slots_booked)
      ? docData.slots_booked
      : [];

    // Mengecek apakah slot sudah dipesan
    if (slots_booked.includes(`${slotDate}-${slotTime}`)) {
      return res
        .status(400)
        .json({ success: false, msg: "Slot is already booked" });
    } else {
      slots_booked.push(`${slotDate}-${slotTime}`);
    }

    // Mendapatkan data pengguna
    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Menghapus slots_booked dari docData sebelum menyimpannya dalam janji temu
    const docDataCopy = { ...docData._doc };
    delete docDataCopy.slots_booked;

    // Membuat data janji temu
    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData: docDataCopy,
      amount: docData.fees,
      date: Date.now(),
    };

    // Menyimpan janji temu baru
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Menyimpan data slot yang telah dipesan
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.status(200).json({ success: true, data: newAppointment });
  } catch (error) {
    console.error("Error booking appointment:", error.message); // Log error detail
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await appointmentModel.find({ userId });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error getting appointments:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an appointment
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedAppointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const { _id } = req.params;
    const cancelledAppointment = await appointmentModel.findByIdAndUpdate(
      _id,
      { cancelled: true },
      { new: true }
    );
    if (!cancelledAppointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res.status(200).json({ success: true, data: cancelledAppointment });
  } catch (error) {
    console.error("Error cancelling appointment:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  userLogin,
  getUserProfile,
  updateUserProfile,
  bookAppointment,
  getUserAppointments,
  updateAppointment,
  cancelAppointment,
};
