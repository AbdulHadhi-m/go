import express from "express";
import {
  addReview,
  getBusReviews,
  markHelpfulReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/bus/:busId", getBusReviews);

// Protected routes
router.post("/", protect, addReview);
router.put("/:id/helpful", protect, markHelpfulReview);
router.delete("/:id", protect, deleteReview);

export default router;
