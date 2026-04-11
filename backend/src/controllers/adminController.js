import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Bus from "../models/busModel.js";
import Trip from "../models/tripModel.js";
import Booking from "../models/bookingModel.js";
import Complaint from "../models/complaintModel.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, users });
});

export const toggleUserBlock = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot block another admin");
  }
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.status(200).json({
    success: true,
    message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
    user: { _id: user._id, isBlocked: user.isBlocked },
  });
});

export const getAllOperators = asyncHandler(async (req, res) => {
  const operators = await User.find({
    $or: [{ role: "operator" }, { operatorApplicationStatus: "pending" }],
  })
    .select("-password")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, operators });
});

export const approveOperator = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.role = "operator";
  user.operatorApplicationStatus = "approved";
  user.operatorApplicationNote = "Approved by admin";
  user.isBlocked = false;
  await user.save();
  res.status(200).json({ success: true, message: "Operator approved", user });
});

export const rejectOperator = asyncHandler(async (req, res) => {
  const { reason = "Rejected by admin" } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.role = "user";
  user.operatorApplicationStatus = "rejected";
  user.operatorApplicationNote = reason;
  await user.save();
  res.status(200).json({ success: true, message: "Operator request rejected", user });
});

export const getAllBuses = asyncHandler(async (req, res) => {
  const buses = await Bus.find({}).populate("operator", "firstName lastName email").sort({ createdAt: -1 });
  res.status(200).json({ success: true, buses });
});

export const deleteAnyBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }
  await Trip.updateMany({ bus: bus._id }, { $set: { bus: null } });
  await bus.deleteOne();
  res.status(200).json({ success: true, message: "Bus deleted by admin" });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate("user", "firstName lastName email phone")
    .populate("trip")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, bookings });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalOperators,
    totalBuses,
    totalTrips,
    totalBookings,
    cancelledTickets,
    activeRoutes,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "operator" }),
    Bus.countDocuments({}),
    Trip.countDocuments({}),
    Booking.countDocuments({}),
    Booking.countDocuments({ bookingStatus: "cancelled" }),
    Trip.countDocuments({ tripStatus: { $in: ["scheduled", "live"] } }),
  ]);

  const revenueAgg = await Booking.aggregate([
    { $match: { bookingStatus: { $ne: "cancelled" } } },
    { $group: { _id: null, totalRevenue: { $sum: "$finalAmount" } } },
  ]);
  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  const now = new Date();
  const last7 = new Date(now);
  last7.setDate(now.getDate() - 6);

  const dailyBookingsAgg = await Booking.aggregate([
    { $match: { createdAt: { $gte: last7 } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
  ]);

  const dailyBookings = dailyBookingsAgg.map((item) => ({
    date: `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(
      item._id.day
    ).padStart(2, "0")}`,
    count: item.count,
  }));

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalOperators,
      totalBuses,
      totalTrips,
      totalBookings,
      totalRevenue,
      cancelledTickets,
      activeRoutes,
    },
    dailyBookings,
  });
});

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
  res.status(200).json({ success: true, message: "Complaint updated", complaint });
});
