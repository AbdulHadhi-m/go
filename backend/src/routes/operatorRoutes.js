import express from "express";
import {
  addTripOffer,
  cancelTrip,
  createBus,
  createTrip,
  deleteBus,
  deleteTrip,
  getMyBuses,
  getMyTrips,
  getOperatorBookings,
  getPassengerListByTrip,
  getRevenueSummary,
  getRoutePerformance,
  markTripCompleted,
  updateBus,
  updateTrip,
} from "../controllers/operatorController.js";
import { operatorOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, operatorOnly);

router.post("/buses", createBus);
router.get("/buses", getMyBuses);
router.put("/buses/:id", updateBus);
router.delete("/buses/:id", deleteBus);

router.post("/trips", createTrip);
router.get("/trips", getMyTrips);
router.put("/trips/:id", updateTrip);
router.delete("/trips/:id", deleteTrip);
router.patch("/trips/:id/complete", markTripCompleted);
router.patch("/trips/:id/cancel", cancelTrip);
router.post("/trips/:id/offers", addTripOffer);
router.get("/trips/:id/passengers", getPassengerListByTrip);

router.get("/bookings", getOperatorBookings);
router.get("/summary/revenue", getRevenueSummary);
router.get("/analytics/routes", getRoutePerformance);

export default router;
