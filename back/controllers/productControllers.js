const Product = require("../models/product");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//get all the products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.log("Error to fetching data", error);
        res.status(500).json({ message: "Server Error" });
    }
};

//get single product by id
const getSingleProduct = async (req, res) => {
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
const createProduct = async (req, res) => {
    try {
        const { name, imageUrl, price, description } = req.body;

        // Validate required fields
        if (!name || !imageUrl || !price || !description) {
            return res.status(400).json({ message: "Please fill all the fields" });
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
        res.status(500).json({ message: error.message });
    }
};

//update a product

const updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ message: "Inavlid Product id" });
        }

        const updateProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updateProduct) {
            return res
                .status(404)
                .json({ message: "Product Not Found" });
        }
        res.json(updateProduct);
    } catch (error) {
        cosole.log("Error to update product", error);
        res
            .status(500)
            .json({ message: "Server Error" });
    }
};

//delete product by id 
const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ message: "Invalid Product id" });
        }
        const deleteProduct = await Product.findByIdAndDelete(id);
        if (!deleteProduct) {
            return res
                .status(404)
                .json({ message: "Product Not Found" });
        }

        res
            .json({
                message: "Product Deleted Successfully"
            });
    } catch (error) {
        console.log("Error to delete product", error);
        res
            .status(500)
            .json({ message: "Server Error" });
    }
}

// Export the function

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProductById,
    deleteProductById
};
