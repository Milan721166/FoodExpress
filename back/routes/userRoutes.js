
const express = require('express');
const {
    signupUser,
    loginUser,
    allUsers,
    singleUserById,
    updateUserProfile
} = require('../controllers/userControllers'); // Corrected import

const protect = require('../middleware/auth'); // Import the authentication middleware

const router = express.Router();

// Route to register a new user
router.post('/signup', signupUser);

// Route to login a user
router.post('/login', loginUser);

// Route to get all users (protected route)
router.get('/allUser', allUsers);

// Route to get a single user by ID (protected route)
router.get('/singleuser/:id', protect, singleUserById);

// Route to update a user's profile (protected route)
router.put('/updateuser', protect, updateUserProfile);

module.exports = router;