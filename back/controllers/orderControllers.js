const express = require('express');
const connectDB = require('../config/db');
const userRoutes = require('../routes/userRoutes');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Order = require('../models/orders');
const sendOrderEmail = require('../utils/mailer');
//const { body, validationResult } = require('express-validator');
require('dotenv').config();
const authenticateToken = require('../middleware/auth');
const app = express();


// Fetch all orders
// const allOrders = async (req, res) => {
//     try {
//         const orders = await Order.find();
//         res.status(200).json(orders);
//     } catch (err) {
//         console.error('Error fetching orders:', err);
//         res.status(500).json({ message: 'An internal server error occurred.' });
//     }
// };



const allOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'userName email')           // Populate user name and email
            .populate('items.product', 'name');           // Populate product name
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// //create a new order
// const createOrder = async (req, res) => {
//     try {
//         const { user, items, totalAmount } = req.body;

//         if (!user || !items || !totalAmount) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         const order = new Order({ user, items, totalAmount });
//         const savedOrder = await order.save();


//         // ✅ Populate both user email and product name
//         await savedOrder.populate([
//             { path: 'user', select: 'email' },
//             { path: 'items.product', select: 'name' }
//         ]);

//         // Send email with full order (including user's email)
//         await sendOrderEmail(savedOrder);

//         res.status(201).json(savedOrder);
//     } catch (error) {
//         console.error('Error creating order:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// };

// module.exports = { createOrder };




// const createOrder = async (req, res) => {
//     try {
//         const { user, items, totalAmount } = req.body;

//         if (!user || !items || !totalAmount) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         const order = new Order({ user, items, totalAmount });
//         const savedOrder = await order.save();

//         // ✅ Properly populate user and product name
//         await savedOrder.populate('user', 'email');
//         await savedOrder.populate({
//             path: 'items.product',
//             select: 'name'
//         });

//         await sendOrderEmail(savedOrder);

//         res.status(201).json(savedOrder);
//     } catch (error) {
//         console.error('Error creating order:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// };

// module.exports = { createOrder };





// const createOrder = async (req, res) => {
//     try {
//         const { user, items, totalAmount } = req.body;

//         if (!user || !items || !totalAmount) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         const order = new Order({ user, items, totalAmount });
//         await order.save();

//         // ✅ Fully populate with nested product name and user email
//         const populatedOrder = await Order.findById(order._id)
//             .populate({ path: 'user', select: 'email' })
//             .populate({ path: 'items.product', select: 'name' })
//             .lean(); // returns plain object for debugging

//         await sendOrderEmail(populatedOrder); // 👈 must pass populated order

//         res.status(201).json(populatedOrder);
//     } catch (error) {
//         console.error('Error creating order:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// };

// module.exports = { createOrder };



const createOrder = async (req, res) => {
    try {
        const { user, items, totalAmount } = req.body;

        if (!user || !items || !totalAmount) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const order = new Order({ user, items, totalAmount });
        await order.save();

        const populatedOrder = await Order.findById(order._id)
            .populate({ path: 'items.product', select: 'name price' })
            .lean();

        await sendOrderEmail(populatedOrder); // ✅ Send email with full info

        res.status(201).json(populatedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = { createOrder, allOrders };