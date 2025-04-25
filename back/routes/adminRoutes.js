import express from 'express';
import { adminLogin, getAdminProfile } from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin); // Ensure this route exists and is a POST method

// Protected routes
router.get('/profile', protectAdmin, getAdminProfile);

export default router;