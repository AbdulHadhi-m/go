import express from "express";
import {
  getAllTrips,
  getTripById,
  getAvailableSeats,
} from "../controllers/tripController.js";

const router = express.Router();

router.get("/", getAllTrips);
router.get("/:id", getTripById);
router.get("/:id/seats", getAvailableSeats);

export default router;