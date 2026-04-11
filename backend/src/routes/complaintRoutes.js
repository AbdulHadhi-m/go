import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createComplaint, getMyComplaints } from "../controllers/complaintController.js";

const router = express.Router();

router.use(protect);
router.post("/", createComplaint);
router.get("/my", getMyComplaints);

export default router;
