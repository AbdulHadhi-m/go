import asyncHandler from "express-async-handler";
import Complaint from "../../models/complaintModel.js";

export const getComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({})
    .populate("user", "firstName lastName email")
    .populate("handledBy", "firstName lastName")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, complaints });
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status, resolutionNote = "" } = req.body;
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  complaint.status = status || complaint.status;
  complaint.resolutionNote = resolutionNote;
  complaint.handledBy = req.user._id;

  await complaint.save();

  res.status(200).json({
    success: true,
    message: "Complaint updated",
    complaint,
  });
});