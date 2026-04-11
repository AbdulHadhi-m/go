import asyncHandler from "express-async-handler";
import Trip from "../../models/tripModel.js";
import Booking from "../../models/bookingModel.js";

export const getPassengerListByTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (req.user.role !== "admin" && trip.operator?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const bookings = await Booking.find({
    trip: trip._id,
    bookingStatus: { $ne: "cancelled" },
  }).populate("user", "firstName lastName email phone");

  const passengers = bookings.flatMap((booking) =>
    (booking.passengerDetails || []).map((p, idx) => ({
      bookingId: booking._id,
      seat: booking.seats?.[idx] || booking.seats?.join(", ") || "",
      name: p.name,
      age: p.age,
      gender: p.gender,
      contact: booking.user?.phone || booking.user?.email || "",
    }))
  );

  res.status(200).json({ success: true, passengers, trip });
});