import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  changePassword,
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
} from "../controllers/userController.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);
router.put("/change-password", changePassword);
router.put("/avatar", upload.single('avatar'), uploadAvatar);

export default router;
