import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Get all users
export const allUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Register a user
export const signupUser = async (req, res) => {
  try {
    const { userName, email, mobNum, password, address } = req.body;
    if (!userName || !email || !mobNum || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      userName,
      email,
      mobNum,
      password: hashedPassword,
      address,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Login a user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.status(200).json({
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        mobNum: user.mobNum,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get a single user by ID
export const singleUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update a user's profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userName, email, mobNum, address, password } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.mobNum = mobNum || user.mobNum;
    user.address = address || user.address;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};
