import express from "express";
import {
  applyCoupon,
  createCoupon,
  getAllCoupons,
  toggleCouponStatus,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, applyCoupon);
router.get("/:code/validate", protect, validateCoupon);

router.post("/", protect, adminOnly, createCoupon);
router.get("/", protect, adminOnly, getAllCoupons);
router.put("/:id", protect, adminOnly, updateCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);
router.patch("/:id/toggle", protect, adminOnly, toggleCouponStatus);

export default router;
