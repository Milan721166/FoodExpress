import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import User from '../models/user.js';

const verifyToken = async (token, Model) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Model.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
};

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    req.admin = await verifyToken(token, Admin);
    next();
  } catch (error) {
    res.status(401).json({ 
      message: error.message || 'Not authorized, token failed' 
    });
  }
};

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    req.user = await verifyToken(token, User);
    next();
  } catch (error) {
    res.status(401).json({ 
      message: error.message || 'Not authorized, token failed' 
    });
  }
};

// Combined middleware for both admin and user
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      req.admin = await verifyToken(token, Admin);
      return next();
    } catch (adminError) {
      req.user = await verifyToken(token, User);
      return next();
    }
  } catch (error) {
    res.status(401).json({ 
      message: error.message || 'Not authorized, token failed' 
    });
  }
};