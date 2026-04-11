import express from "express";
import {
  addFavorite,
  checkFavoriteStatus,
  getMyFavorites,
  removeFavorite,
  toggleFavorite,
} from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/my", getMyFavorites);
router.post("/toggle", toggleFavorite);
router.get("/check/:tripId", checkFavoriteStatus);
router.post("/", addFavorite);
router.delete("/:id", removeFavorite);

export default router;
