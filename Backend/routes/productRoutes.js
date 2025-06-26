import express from "express";
import {
  getAllProducts,
  getSingleProduct,
  getProductsByRestaurant,
  createProduct,
  updateProductById,
  deleteProductById,
} from "../controllers/productControllers.js";
import { protectRestaurant } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public product routes
router.get("/", getAllProducts);
router.get("/restaurant/:restaurantId", getProductsByRestaurant); // <-- MOVE THIS ABOVE
router.get("/:id", getSingleProduct);

// Protected product routes (restaurant only)
router.post("/", protectRestaurant, createProduct);
router.put("/:id", protectRestaurant, updateProductById);
router.delete("/:id", protectRestaurant, deleteProductById);

export default router;
