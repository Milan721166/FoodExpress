import dotenv from "dotenv";
import Resturant from "../models/resturant.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

dotenv.config();

export const getAllResturant = async (req, res) => {
  try {
    const resturants = await Resturant.find();
    res.status(200).json(resturants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Admin creates restaurant (with password)
export const adminCreateResturant = async (req, res) => {
  try {
    const {
      name,
      location,
      image,
      resturantType,
      email,
      mobileNum,
      username,
      password,
    } = req.body;

    if (
      !name ||
      !location ||
      !image ||
      !resturantType ||
      !email ||
      !mobileNum ||
      !username ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await Resturant.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const resturant = new Resturant({
      name,
      location,
      image,
      resturantType,
      email,
      mobileNum,
      username,
      password: hashedPassword,
    });

    const saved = await resturant.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Restaurant login
export const resturantLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const resturant = await Resturant.findOne({ username });
    if (!resturant) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, resturant.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign(
      { id: resturant._id, username: resturant.username, role: "resturant" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.status(200).json({
      token,
      resturant: { _id: resturant._id, username: resturant.username },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateResturant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedResturant = await Resturant.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );
    if (!updatedResturant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }
    res.status(200).json(updatedResturant);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteResturant = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedResturant = await Resturant.findByIdAndDelete(id);
    if (!deletedResturant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }
    res.status(200).json({ message: "Restaurant deleted successfully." });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
