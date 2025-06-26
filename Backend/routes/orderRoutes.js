import express from "express";
import {
  createOrder,
  getUserOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/orderControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createOrder);
router.get("/myorders", protect, getUserOrders);
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);

export default router;
