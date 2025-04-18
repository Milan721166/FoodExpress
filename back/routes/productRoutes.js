const express = require('express');
const {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProductById,
    deleteProductById
} = require('../controllers/productControllers');

const router = express.Router();

// Route to get all products
router.get('/', getAllProducts);

// Route to get a single product by ID
router.get('/:id', getSingleProduct);

// Route to create a new product
router.post('/', createProduct);

// Route to update a product by ID
router.put('/:id', updateProductById);

// Route to delete a product by ID
router.delete('/:id', deleteProductById);

module.exports = router;