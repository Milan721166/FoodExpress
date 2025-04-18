const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: admin.username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, admin: { username: admin.username } });
  } catch (error) {
    console.error('Error during admin login:', error.message);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

module.exports = adminLogin;