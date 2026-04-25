import express from "express";
import {
  getRewardBalance,
  getRewardHistory,
  getRedeemPreview,
} from "../controllers/rewardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/balance", protect, getRewardBalance);
router.get("/history", protect, getRewardHistory);
router.post("/redeem-preview", protect, getRedeemPreview);

export default router;
