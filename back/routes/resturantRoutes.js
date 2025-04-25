import express from "express";
import { getAllResturant, createNewResturant } from "../controllers/resturantController.js";

const router = express.Router();

// Define restaurant routes
router.get("/", getAllResturant);
router.post("/addResturant", createNewResturant);

export default router;