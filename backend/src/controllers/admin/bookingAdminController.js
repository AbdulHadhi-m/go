import asyncHandler from "express-async-handler";
import Booking from "../../models/bookingModel.js";

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate("user", "firstName lastName email phone")
    .populate("trip")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, bookings });
});