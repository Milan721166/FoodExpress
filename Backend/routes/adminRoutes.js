import express from "express";
import {
  signupAdmin,
  adminLogin,
  getAdminProfile,
} from "../controllers/adminController.js";
import {
  getAllResturant,
  adminCreateResturant,
  updateResturant,
  deleteResturant,
} from "../controllers/resturantController.js";
import {
  protectAdmin,
  protectAdminOrRestaurant,
} from "../middleware/authMiddleware.js";
import { allUsers, deleteUserByAdmin } from "../controllers/userControllers.js";

const router = express.Router();

// Public routes
router.post("/signup", signupAdmin); // Admin signup
router.post("/login", adminLogin); // Admin login

// Protected admin routes
router.get("/profile", protectAdmin, getAdminProfile); // Get admin profile

// Restaurant management (admin only)
router.get("/restaurants", protectAdmin, getAllResturant); // Get all restaurants
router.post("/restaurants", protectAdmin, adminCreateResturant); // Add restaurant
router.put("/restaurants/:id", protectAdmin, updateResturant); // Update restaurant
router.delete("/restaurants/:id", protectAdmin, deleteResturant); // Delete restaurant

// Get all users (admin or restaurant only)
router.delete("/user/:id", protectAdmin, deleteUserByAdmin); // Add this line
router.get("/allUser", protectAdminOrRestaurant, allUsers);
export default router;
