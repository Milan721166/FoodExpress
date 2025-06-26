import express from "express";
import {
  addReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;
