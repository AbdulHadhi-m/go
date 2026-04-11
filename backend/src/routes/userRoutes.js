import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  changePassword,
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
} from "../controllers/userController.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);
router.put("/change-password", changePassword);
router.put("/avatar", uploadAvatar);

export default router;
