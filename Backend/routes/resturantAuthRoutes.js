import express from "express";
import {
  adminCreateResturant,
  resturantLogin,
} from "../controllers/resturantController.js";
import {
  protectAdmin,
  protectAdminOrRestaurant,
} from "../middleware/authMiddleware.js";
import { allUsers } from "../controllers/userControllers.js";

const router = express.Router();

// Only admin can create restaurant accounts
router.post("/signup", protectAdmin, adminCreateResturant);

// Restaurant login
router.post("/login", resturantLogin);

// Get all users (admin or restaurant only)
router.get("/allUser", protectAdminOrRestaurant, allUsers);

export default router;
