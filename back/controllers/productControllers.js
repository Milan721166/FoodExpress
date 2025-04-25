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

//create a new product 
export const createProduct = async (req, res) => {
    try {
        const { name, imageUrl, price, description } = req.body;

        // Validate required fields
        if (!name || !imageUrl || !price || !description) {
            return res.status(400).json({ message: "Please fill all the fields." });
        }

        // Create a new product
        const newProduct = new Product({
            name,
            imageUrl,
            price,
            description,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

//update a product
export const updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Product id" });
        }

        const updateProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updateProduct) {
            return res.status(404).json({ message: "Product Not Found" });
        }
        res.json(updateProduct);
    } catch (error) {
        console.log("Error updating product:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

//delete product by id 
export const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate product ID
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required.' });
        }

        // Delete the product
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Export the function

export default {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProductById,
    deleteProductById
};
