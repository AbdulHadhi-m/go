import asyncHandler from "express-async-handler";
import Bus from "../../models/busModel.js";
import Trip from "../../models/tripModel.js";

export const getAllBuses = asyncHandler(async (req, res) => {
  const buses = await Bus.find({})
    .populate("operator", "firstName lastName email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, buses });
});

export const deleteAnyBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }

  await Trip.updateMany({ bus: bus._id }, { $set: { bus: null } });
  await bus.deleteOne();

  res.status(200).json({ success: true, message: "Bus deleted by admin" });
});