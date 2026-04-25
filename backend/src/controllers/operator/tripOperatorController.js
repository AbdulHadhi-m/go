import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Bus from "../../models/busModel.js";
import Trip from "../../models/tripModel.js";
import Booking from "../../models/bookingModel.js";
import { issueRewardForCompletedBooking } from "../../services/rewardService.js";
import { calcOccupancy, calculateDynamicFare } from "./operatorHelpers.js";

export const createTrip = asyncHandler(async (req, res) => {
  const {
    busId,
    from,
    to,
    departureTime,
    arrivalTime,
    journeyDate,
    seatPrice,
    totalSeats,
    boardingPoints,
  } = req.body;

  if (!busId || !from || !to || !departureTime || !arrivalTime || !journeyDate) {
    res.status(400);
    throw new Error("Missing required trip fields");
  }

  if (!mongoose.Types.ObjectId.isValid(busId)) {
    res.status(400);
    throw new Error("Invalid bus id");
  }

  const bus = await Bus.findById(busId);

  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }

  if (req.user.role !== "admin" && bus.operator.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to create trip for this bus");
  }

  const seats = totalSeats || bus.totalSeats || 40;
  const fare = seatPrice || req.body.fare || 0;

  const trip = await Trip.create({
    operator: req.user.role === "admin" ? bus.operator : req.user._id,
    bus: bus._id,
    busName: bus.name,
    busType: bus.type,
    from,
    to,
    departureTime,
    arrivalTime,
    journeyDate,
    fare,
    seatPrice: fare,
    totalSeats: seats,
    availableSeats: seats,
    bookedSeats: [],
    boardingPoints: (boardingPoints || []).sort((a, b) => a.sequence - b.sequence),
    droppingPoints: (req.body.droppingPoints || []).sort((a, b) => a.sequence - b.sequence),
    dynamicPricingEnabled: req.body.dynamicPricingEnabled ?? true,
    weekendMultiplier: req.body.weekendMultiplier || 1.1,
    offers: req.body.offers || [],
  });

  res.status(201).json({ success: true, trip });
});

export const getMyTrips = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { operator: req.user._id };

  const trips = await Trip.find(filter).populate("bus").sort({ journeyDate: -1 });

  const enhanced = trips.map((trip) => ({
    ...trip.toObject(),
    occupancyPercentage: calcOccupancy(trip),
    effectiveFare: calculateDynamicFare(trip),
  }));

  res.status(200).json({ success: true, trips: enhanced });
});

export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (req.user.role !== "admin" && trip.operator?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this trip");
  }

  Object.assign(trip, req.body);

  if (req.body.seatPrice !== undefined) {
    trip.fare = req.body.seatPrice;
  }

  await trip.save();

  res.status(200).json({ success: true, trip });
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (req.user.role !== "admin" && trip.operator?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this trip");
  }

  await trip.deleteOne();

  res.status(200).json({
    success: true,
    message: "Trip deleted successfully",
  });
});

export const markTripCompleted = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (req.user.role !== "admin" && trip.operator?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  trip.tripStatus = "completed";
  await trip.save();

  // Also update all confirmed bookings for this trip to completed
  const bookings = await Booking.find({ trip: trip._id, bookingStatus: "confirmed" });
  
  for (const booking of bookings) {
    booking.bookingStatus = "completed";
    await booking.save();
    
    // Issue rewards for each completed booking
    try {
      await issueRewardForCompletedBooking(booking._id);
    } catch (error) {
      console.error(`Failed to issue reward for booking ${booking._id}:`, error);
    }
  }

  res.status(200).json({ success: true, trip });
});

export const cancelTrip = asyncHandler(async (req, res) => {
  const { reason = "Cancelled by operator" } = req.body;

  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (req.user.role !== "admin" && trip.operator?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  trip.tripStatus = "cancelled";
  trip.cancelledReason = reason;

  await trip.save();

  res.status(200).json({ success: true, trip });
});

export const addTripOffer = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (req.user.role !== "admin" && trip.operator?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const { title, description, discountType, discountValue } = req.body;

  trip.offers.push({
    title,
    description,
    discountType: discountType || "percentage",
    discountValue: discountValue || 0,
    isActive: true,
  });

  await trip.save();

  res.status(200).json({ success: true, trip });
});