import asyncHandler from "express-async-handler";
import Complaint from "../models/complaintModel.js";

export const createComplaint = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) {
    res.status(400);
    throw new Error("Subject and message are required");
  }
  const complaint = await Complaint.create({
    user: req.user._id,
    subject,
    message,
  });
  res.status(201).json({ success: true, complaint });
});

export const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, complaints });
});
