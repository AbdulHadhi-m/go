import asyncHandler from "express-async-handler";
import Bus from "../../models/busModel.js";
import Trip from "../../models/tripModel.js";

export const createBus = asyncHandler(async (req, res) => {
  const { name, busNumber, type, totalSeats, amenities, maintenanceStatus, driver } =
    req.body;

  if (!name || !busNumber) {
    res.status(400);
    throw new Error("name and busNumber are required");
  }

  const exists = await Bus.findOne({
    busNumber: String(busNumber).toUpperCase(),
  });

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

  res.status(200).json({
    success: true,
    message: "Bus deleted successfully",
  });
});