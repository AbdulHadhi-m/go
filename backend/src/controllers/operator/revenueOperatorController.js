import asyncHandler from "express-async-handler";
import Trip from "../../models/tripModel.js";
import Booking from "../../models/bookingModel.js";

export const getRevenueSummary = asyncHandler(async (req, res) => {
  const tripFilter = req.user.role === "admin" ? {} : { operator: req.user._id };

  const trips = await Trip.find(tripFilter).select("_id");
  const tripIds = trips.map((t) => t._id);

  const summary = await Booking.aggregate([
    {
      $match: {
        trip: { $in: tripIds },
        bookingStatus: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        grossRevenue: { $sum: "$totalAmount" },
        totalDiscount: { $sum: "$discountAmount" },
        netRevenue: { $sum: "$finalAmount" },
      },
    },
  ]);

  const data = summary[0] || {
    totalBookings: 0,
    grossRevenue: 0,
    totalDiscount: 0,
    netRevenue: 0,
  };

  res.status(200).json({ success: true, summary: data });
});