import Product from "../models/product.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//get all the products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log("Error to fetching data", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//get single product by id
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product id" });
    }
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    res.json(product);
  } catch (error) {
    console.log("Error to fetching data", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all products for a specific restaurant
export const getProductsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const products = await Product.find({ restaurant: restaurantId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Create a new product (restaurant only)
export const createProduct = async (req, res) => {
  try {
    const { name, imageUrl, price, description } = req.body;
    const restaurantId = req.resturant._id; // From protectRestaurant middleware

    const product = new Product({
      name,
      imageUrl,
      price,
      description,
      restaurant: restaurantId,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update a product (only if owned by restaurant)
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.resturant._id;

    const product = await Product.findOne({
      _id: id,
      restaurant: restaurantId,
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or not authorized." });
    }

    Object.assign(product, req.body);
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete a product (only if owned by restaurant)
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.resturant._id;

    const product = await Product.findOneAndDelete({
      _id: id,
      restaurant: restaurantId,
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or not authorized." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};
// Export the function

export default {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProductById,
  deleteProductById,
};
