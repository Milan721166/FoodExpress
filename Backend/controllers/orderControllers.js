import Order from "../models/orders.js";
import User from "../models/user.js";
import Product from "../models/product.js";
import Resturant from "../models/resturant.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { restaurant, products, totalAmount } = req.body;

    if (!restaurant || !products || !totalAmount) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const order = new Order({
      user: userId,
      restaurant,
      products,
      totalAmount,
    });

    const savedOrder = await order.save();

    // Add order to user's order history
    await User.findByIdAndUpdate(userId, { $push: { orders: savedOrder._id } });

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all orders for the logged-in user (with restaurant and product details)
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate("restaurant", "name location")
      .populate("products.product", "name price imageUrl");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update an order (only if owned by user)
export const updateOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateFields = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: id, user: userId },
      updateFields,
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or not authorized." });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete an order (only if owned by user)
export const deleteOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await Order.findOneAndDelete({ _id: id, user: userId });
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or not authorized." });
    }
    // Remove order from user's order history
    await User.findByIdAndUpdate(userId, { $pull: { orders: id } });

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};
