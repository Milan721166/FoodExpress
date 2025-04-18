const express = require("express");
const router = express.Router();

const { createOrder, allOrders } = require("../controllers/orderControllers");

// ✅ Route must pass the function itself, not the result of calling it
router.post("/create", createOrder);

router.get("/allOrders", allOrders);

module.exports = router;
