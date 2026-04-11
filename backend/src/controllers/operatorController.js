import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Bus from "../models/busModel.js";
import Trip from "../models/tripModel.js";
import Booking from "../models/bookingModel.js";

const calcOccupancy = (trip) => {
  if (!trip?.totalSeats || trip.totalSeats <= 0) return 0;
  const booked = trip.totalSeats - trip.availableSeats;
  return Number(((booked / trip.totalSeats) * 100).toFixed(2));
};

const calculateDynamicFare = (trip) => {
  const baseFare = Number(trip.fare || trip.seatPrice || 0);
  if (!trip.dynamicPricingEnabled) return baseFare;
  const day = new Date(trip.journeyDate).getDay();
  const isWeekend = day === 0 || day === 6;
  if (!isWeekend) return baseFare;
  return Number((baseFare * (trip.weekendMultiplier || 1.1)).toFixed(2));
};

export const createBus = asyncHandler(async (req, res) => {
  const { name, busNumber, type, totalSeats, amenities, maintenanceStatus, driver } =
    req.body;

  if (!name || !busNumber) {
    res.status(400);
    throw new Error("name and busNumber are required");
  }

  const exists = await Bus.findOne({ busNumber: String(busNumber).toUpperCase() });
  if (exists) {
    res.status(400);
    throw new Error("Bus number already exists");
  }

  const bus = await Bus.create({
    operator: req.user._id,
    name,
    busNumber,
    type,
    totalSeats,
    amenities: amenities || [],
    maintenanceStatus: maintenanceStatus || "active",
    driver: driver || {},
  });

  res.status(201).json({ success: true, bus });
});

export const getMyBuses = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { operator: req.user._id };
  const buses = await Bus.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, buses });
});

export const updateBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }

  if (req.user.role !== "admin" && bus.operator.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this bus");
  }

  Object.assign(bus, req.body);
  await bus.save();

  res.status(200).json({ success: true, bus });
});

export const deleteBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }

  if (req.user.role !== "admin" && bus.operator.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this bus");
  }

  const activeTrips = await Trip.countDocuments({
    bus: bus._id,
    tripStatus: { $in: ["scheduled", "live"] },
  });
  if (activeTrips > 0) {
    res.status(400);
    throw new Error("Cannot delete bus with active trips");
  }

  await bus.deleteOne();
  res.status(200).json({ success: true, message: "Bus deleted successfully" });
});

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
    boardingPoints: boardingPoints || [],
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
  res.status(200).json({ success: true, message: "Trip deleted successfully" });
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

export const getRevenueSummary = asyncHandler(async (req, res) => {
  const tripFilter = req.user.role === "admin" ? {} : { operator: req.user._id };
  const trips = await Trip.find(tripFilter).select("_id");
  const tripIds = trips.map((t) => t._id);

  const summary = await Booking.aggregate([
    { $match: { trip: { $in: tripIds }, bookingStatus: { $ne: "cancelled" } } },
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

export const getRoutePerformance = asyncHandler(async (req, res) => {
  const tripFilter = req.user.role === "admin" ? {} : { operator: req.user._id };
  const trips = await Trip.find(tripFilter);

  const routeMap = new Map();
  trips.forEach((trip) => {
    const key = `${trip.from} -> ${trip.to}`;
    const current = routeMap.get(key) || {
      route: key,
      trips: 0,
      averageOccupancy: 0,
      completedTrips: 0,
      cancelledTrips: 0,
    };
    current.trips += 1;
    current.averageOccupancy += calcOccupancy(trip);
    if (trip.tripStatus === "completed") current.completedTrips += 1;
    if (trip.tripStatus === "cancelled") current.cancelledTrips += 1;
    routeMap.set(key, current);
  });

  const analytics = Array.from(routeMap.values()).map((row) => ({
    ...row,
    averageOccupancy: row.trips ? Number((row.averageOccupancy / row.trips).toFixed(2)) : 0,
  }));

  res.status(200).json({ success: true, analytics });
});
