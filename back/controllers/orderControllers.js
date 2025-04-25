import mongoose from 'mongoose';
import Order from '../models/orders.js';
import { sendOrderEmail } from '../utils/mailer.js'; // Import the mailer utility

export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'userName email') // Populate user details
      .populate('items.product', 'name price'); // Populate product details
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { user, items, totalAmount } = req.body;

    if (!user || !items || !totalAmount) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Cast user to ObjectId
    const userId = mongoose.Types.ObjectId.isValid(user) ? mongoose.Types.ObjectId(user) : null;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const order = new Order({ user: userId, items, totalAmount });
    const savedOrder = await order.save();

    // Send order email
    try {
      await sendOrderEmail({
        user, 
        items, 
        totalAmount, 
        orderId: savedOrder._id, // Pass the order ID
      });
      console.log('Order email sent successfully.');
    } catch (emailError) {
      console.error('Error sending order email:', emailError);
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};