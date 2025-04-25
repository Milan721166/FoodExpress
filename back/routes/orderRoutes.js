import express from "express";
import { createOrder, allOrders } from "../controllers/orderControllers.js";

const router = express.Router();

// ✅ Route must pass the function itself, not the result of calling it
router.post("/create", createOrder);
router.get("/allOrders", allOrders);

export default router;
