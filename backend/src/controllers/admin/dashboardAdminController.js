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
        revenue: { $sum: { $cond: [ { $gt: ["$finalAmount", 0] }, "$finalAmount", "$totalAmount" ] } },
      },
    },
  ]);

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    last7Days.push({ date: dateStr, count: 0, revenue: 0 });
  }

  dailyBookingsAgg.forEach((item) => {
    const dateStr = `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`;
    const day = last7Days.find((d) => d.date === dateStr);
    if (day) {
      day.count = item.count;
      day.revenue = item.revenue;
    }
  });

  const dailyBookings = last7Days;

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