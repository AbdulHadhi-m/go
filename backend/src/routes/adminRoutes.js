import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import {
  approveOperator,
  deleteAnyBus,
  getAllBookings,
  getAllBuses,
  getAllOperators,
  getAllUsers,
  getComplaints,
  getDashboardStats,
  rejectOperator,
  toggleUserBlock,
  updateComplaintStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.patch("/users/:id/block", toggleUserBlock);

router.get("/operators", getAllOperators);
router.patch("/operators/:id/approve", approveOperator);
router.patch("/operators/:id/reject", rejectOperator);

router.get("/buses", getAllBuses);
router.delete("/buses/:id", deleteAnyBus);

router.get("/bookings", getAllBookings);
router.get("/dashboard/stats", getDashboardStats);

router.get("/complaints", getComplaints);
router.patch("/complaints/:id", updateComplaintStatus);

export default router;
