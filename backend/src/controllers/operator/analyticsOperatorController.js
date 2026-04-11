import asyncHandler from "express-async-handler";
import Trip from "../../models/tripModel.js";
import { calcOccupancy } from "./operatorHelpers.js";

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
    averageOccupancy: row.trips
      ? Number((row.averageOccupancy / row.trips).toFixed(2))
      : 0,
  }));

  res.status(200).json({ success: true, analytics });
});