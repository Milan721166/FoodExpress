// // import jwt from 'jsonwebtoken';
// // import { Admin } from '../models/Admin.js';
// // import User from '../models/user.js';

// // const verifyToken = async (token, Model) => {
// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     const user = await Model.findById(decoded.id).select('-password');

// //     if (!user) {
// //       throw new Error('User not found');
// //     }

// //     return user;
// //   } catch (error) {
// //     console.error('Token verification error:', error);
// //     throw error;
// //   }
// // };

// // export const protectAdmin = async (req, res, next) => {
// //   try {
// //     const token = req.headers.authorization?.split(' ')[1];

// //     if (!token) {
// //       return res.status(401).json({ message: 'Not authorized, no token' });
// //     }

// //     req.admin = await verifyToken(token, Admin);
// //     next();
// //   } catch (error) {
// //     res.status(401).json({
// //       message: error.message || 'Not authorized, token failed'
// //     });
// //   }
// // };
// import Resturant from "../models/resturant.js";
// export const protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ message: "Not authorized, no token" });
//     }

//     req.user = await verifyToken(token, User);
//     next();
//   } catch (error) {
//     res.status(401).json({
//       message: error.message || "Not authorized, token failed",
//     });
//   }
// };

// // // Combined middleware for both admin and user
// // export const authenticate = async (req, res, next) => {
// //   try {
// //     const token = req.headers.authorization?.split(' ')[1];

// //     if (!token) {
// //       return res.status(401).json({ message: 'Not authorized, no token' });
// //     }

// //     try {
// //       req.admin = await verifyToken(token, Admin);
// //       return next();
// //     } catch (adminError) {
// //       req.user = await verifyToken(token, User);
// //       return next();
// //     }
// //   } catch (error) {
// //     res.status(401).json({
// //       message: error.message || 'Not authorized, token failed'
// //     });
// //   }
// // };

// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

// export const protectAdmin = (req, res, next) => {
//   let token =
//     req.headers.authorization && req.headers.authorization.startsWith("Bearer")
//       ? req.headers.authorization.split(" ")[1]
//       : null;

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized, no token" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.admin = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Not authorized, token failed" });
//   }
// };

// export const protectRestaurant = async (req, res, next) => {
//   let token =
//     req.headers.authorization && req.headers.authorization.startsWith("Bearer")
//       ? req.headers.authorization.split(" ")[1]
//       : null;

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized, no token" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const resturant = await Resturant.findById(decoded.id).select("-password");
//     if (!resturant) {
//       return res
//         .status(401)
//         .json({ message: "Not authorized, restaurant not found" });
//     }
//     req.resturant = resturant;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Not authorized, token failed" });
//   }
// };

// export const protectAdminOrRestaurant = (req, res, next) => {
//   const token =
//     req.headers.authorization && req.headers.authorization.startsWith("Bearer")
//       ? req.headers.authorization.split(" ")[1]
//       : null;

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized, no token" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.role === "admin" || decoded.role === "resturant") {
//       req.user = decoded;
//       return next();
//     }
//     return res
//       .status(403)
//       .json({ message: "Not authorized, admin or restaurant only" });
//   } catch (err) {
//     res.status(401).json({ message: "Not authorized, token failed" });
//   }
// };

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
import Resturant from "../models/resturant.js";
dotenv.config();

// Protect middleware for users
export const protect = async (req, res, next) => {
  let token =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }
    req.user = { id: user._id, email: user.email, role: "user" };
    next();
  } catch (error) {
    res.status(401).json({
      message: error.message || "Not authorized, token failed",
    });
  }
};

// Protect middleware for admins
export const protectAdmin = (req, res, next) => {
  let token =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Protect middleware for restaurants
export const protectRestaurant = async (req, res, next) => {
  let token =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const resturant = await Resturant.findById(decoded.id).select("-password");
    if (!resturant) {
      return res
        .status(401)
        .json({ message: "Not authorized, restaurant not found" });
    }
    req.resturant = resturant;
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Protect middleware for admin or restaurant
export const protectAdminOrRestaurant = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "admin" || decoded.role === "resturant") {
      req.user = decoded;
      return next();
    }
    return res
      .status(403)
      .json({ message: "Not authorized, admin or restaurant only" });
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
