import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

// User controllers
import {
  getAllUsers,
  toggleUserBlock,
} from "../controllers/admin/userAdminController.js";

// Operator controllers
import {
  getAllOperators,
  approveOperator,
  rejectOperator,
} from "../controllers/admin/operatorAdminController.js";

// Bus controllers
import {
  getAllBuses,
  deleteAnyBus,
} from "../controllers/admin/busAdminController.js";

// Booking controllers
import { getAllBookings } from "../controllers/admin/bookingAdminController.js";

// Dashboard controllers
import { getDashboardStats } from "../controllers/admin/dashboardAdminController.js";

// Complaint controllers
import {
  getComplaints,
  updateComplaintStatus,
} from "../controllers/admin/complaintAdminController.js";

const router = express.Router();

router.use(protect, adminOnly);

// Users
router.get("/users", getAllUsers);
router.patch("/users/:id/block", toggleUserBlock);

// Operators
router.get("/operators", getAllOperators);
router.patch("/operators/:id/approve", approveOperator);
router.patch("/operators/:id/reject", rejectOperator);

// Buses
router.get("/buses", getAllBuses);
router.delete("/buses/:id", deleteAnyBus);

// Bookings
router.get("/bookings", getAllBookings);

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// Complaints
router.get("/complaints", getComplaints);
router.patch("/complaints/:id", updateComplaintStatus);

export default router;