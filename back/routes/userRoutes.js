import express from 'express';
import {
  signupUser,
  loginUser,
  allUsers,
  singleUserById,
  updateUserProfile
} from '../controllers/userControllers.js'; // Corrected import

import { protect } from '../middleware/authMiddleware.js'; // Import the authentication middleware

const router = express.Router();

// Route to register a new user
router.post('/signup', signupUser);

// Route to login a user
router.post('/login', loginUser);

// Route to get all users (protected route)
router.get('/allUser', protect, allUsers);

// Route to get a single user by ID (protected route)
router.get('/singleuser/:id', protect, singleUserById);

// Route to update a user's profile (protected route)
router.put('/updateuser', protect, updateUserProfile);

export default router;