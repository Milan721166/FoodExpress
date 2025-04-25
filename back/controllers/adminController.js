import { Admin } from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Check against .env credentials (fallback)
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      // Check if admin exists in DB, if not create one
      let admin = await Admin.findOne({ username });
      
      if (!admin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        admin = new Admin({
          username,
          password: hashedPassword
        });
        await admin.save();
      }

      const token = jwt.sign(
        { id: admin._id, username: admin.username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ 
        message: 'Login successful', 
        token,
        user: {
          id: admin._id,
          username: admin.username,
          role: 'admin'
        }
      });
    }

    // Database authentication
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

export const createInitialAdmin = async () => {
  try {
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      throw new Error('Admin credentials not configured in .env');
    }

    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const admin = new Admin({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword
      });
      await admin.save();
      console.log('Initial admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
};