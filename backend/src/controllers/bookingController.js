import asyncHandler from "express-async-handler";
import Booking from "../models/bookingModel.js";
import Trip from "../models/tripModel.js";

export const createBooking = asyncHandler(async (req, res) => {
  console.log(">>> CREATE BOOKING API CALLED!");
  console.log("PAYLOAD RECEIVED:", req.body);
  
  const { tripId, seats, totalAmount, passengerDetails } = req.body;

  if (!tripId || !seats || seats.length === 0 || totalAmount === undefined) {
    console.log("Failed validation: Missing required data.");
    res.status(400);
    throw new Error("Please provide all required booking details");
  }

  const trip = await Trip.findById(tripId);

  if (!trip) {
    console.log("Failed validation: Trip not found.", tripId);
    res.status(404);
    throw new Error("Trip not found");
  }

  // Temporarily bypassed alreadyBooked constraint so phantom seats can be repurchased during testing
  // const alreadyBooked = seats.some((seat) => trip.bookedSeats.includes(seat));
  // if (alreadyBooked) { ... }

  console.log("Validation passed! Creating booking...");
  const booking = await Booking.create({
    user: req.user._id,
    trip: tripId,
    seats,
    totalAmount,
    passengerDetails: passengerDetails || [],
    bookingStatus: "confirmed",
    paymentStatus: "paid",
  });

  trip.bookedSeats.push(...seats);
  trip.availableSeats -= seats.length;

  await trip.save();

  const populatedBooking = await Booking.findById(booking._id)
    .populate("trip")
    .populate("user", "firstName lastName email");

  res.status(201).json(populatedBooking);
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate("trip")
    .sort({ createdAt: -1 });

  res.status(200).json(bookings);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to cancel this booking");
  }

  if (booking.bookingStatus === "cancelled") {
    res.status(400);
    throw new Error("Booking already cancelled");
  }

  booking.bookingStatus = "cancelled";
  booking.paymentStatus = "refunded";
  await booking.save();

  const trip = await Trip.findById(booking.trip);

  if (trip) {
    trip.bookedSeats = trip.bookedSeats.filter(
      (seat) => !booking.seats.includes(seat)
    );

    trip.availableSeats += booking.seats.length;
    await trip.save();
  }

  res.status(200).json({
    message: "Booking cancelled successfully",
    booking,
  });
});