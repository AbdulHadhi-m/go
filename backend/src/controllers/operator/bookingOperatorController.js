import asyncHandler from "express-async-handler";
import Trip from "../../models/tripModel.js";
import Booking from "../../models/bookingModel.js";

export const getOperatorBookings = asyncHandler(async (req, res) => {
  const tripFilter = req.user.role === "admin" ? {} : { operator: req.user._id };

  const trips = await Trip.find(tripFilter).select("_id");
  const tripIds = trips.map((t) => t._id);

  const bookings = await Booking.find({ trip: { $in: tripIds } })
    .populate("trip")
    .populate("user", "firstName lastName email phone")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, bookings });
});