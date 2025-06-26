import express from "express";
import {
  signupUser,
  loginUser,
  allUsers,
  singleUserById,
  updateUserProfile,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new user
router.post("/signup", signupUser);

// Login a user
router.post("/login", loginUser);

// Get all users (protected)
router.get("/allUser", protect, allUsers);

// Get a single user by ID (protected)
router.get("/singleuser/:id", protect, singleUserById);

// Update a user's profile (protected)
router.put("/updateuser", protect, updateUserProfile);

export default router;
