import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import Bus from "../../models/busModel.js";
import Trip from "../../models/tripModel.js";
import Booking from "../../models/bookingModel.js";

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