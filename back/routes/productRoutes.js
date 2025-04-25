import express from "express";
import { getAllProducts, getSingleProduct, createProduct, updateProductById, deleteProductById } from "../controllers/productControllers.js";

const router = express.Router();

// Define product routes
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.post("/", createProduct);
router.put("/:id", updateProductById);
router.delete("/:id", deleteProductById);

export default router;