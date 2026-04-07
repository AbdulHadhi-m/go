import asyncHandler from "express-async-handler";
import Trip from "../models/tripModel.js";

// @desc    Get all trips / search trips
// @route   GET /api/trips
// @access  Public
export const getAllTrips = asyncHandler(async (req, res) => {
  const { from, to, date } = req.query;

  const filter = {};

  if (from) {
    filter.from = { $regex: from, $options: "i" };
  }

  if (to) {
    filter.to = { $regex: to, $options: "i" };
  }

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    filter.journeyDate = {
      $gte: start,
      $lt: end,
    };
  }

  const trips = await Trip.find(filter).sort({ journeyDate: 1 });
  res.json(trips);
});

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Public
export const getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  res.json(trip);
});

// @desc    Get seat data
// @route   GET /api/trips/:id/seats
// @access  Public
export const getAvailableSeats = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  res.json({
    totalSeats: trip.totalSeats,
    availableSeats: trip.availableSeats,
    bookedSeats: trip.bookedSeats,
  });
});