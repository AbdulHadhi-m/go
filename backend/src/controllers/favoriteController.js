import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Favorite from "../models/favoriteModel.js";
import Trip from "../models/tripModel.js";

const normalizeRoute = (value = "") => value.trim();

/** Reject bad client values like the string "undefined" or invalid hex ids */
const sanitizeTripId = (tripId) => {
  if (tripId == null || tripId === "") return null;
  const s = String(tripId).trim();
  if (s === "undefined" || s === "null") return null;
  if (!mongoose.Types.ObjectId.isValid(s)) return null;
  return s;
};

const buildFavoriteQuery = ({ userId, tripId, from, to }) => {
  if (tripId) {
    return { user: userId, trip: tripId };
  }

  return { user: userId, trip: null, from, to };
};

export const addFavorite = asyncHandler(async (req, res) => {
  const { tripId: rawTripId, from, to, boardingDate } = req.body;
  const tripId = sanitizeTripId(rawTripId);
  const userId = req.user._id;

  let favoriteData = {
    user: userId,
    trip: null,
    from: normalizeRoute(from),
    to: normalizeRoute(to),
    boardingDate: boardingDate || undefined,
  };

  if (tripId) {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      res.status(404);
      throw new Error("Trip not found");
    }

    favoriteData = {
      user: userId,
      trip: trip._id,
      from: normalizeRoute(trip.from),
      to: normalizeRoute(trip.to),
      boardingDate: trip.journeyDate,
    };
  } else if (!favoriteData.from || !favoriteData.to) {
    res.status(400);
    throw new Error("Please provide tripId or from/to");
  }

  const existing = await Favorite.findOne(
    buildFavoriteQuery({
      userId,
      tripId: favoriteData.trip,
      from: favoriteData.from,
      to: favoriteData.to,
    })
  );

  if (existing) {
    res.status(409);
    throw new Error("Route already in favorites");
  }

  const favorite = await Favorite.create(favoriteData);
  const populatedFavorite = await Favorite.findById(favorite._id).populate("trip");

  res.status(201).json({
    success: true,
    message: "Added to favorites",
    favorite: populatedFavorite,
  });
});

export const getMyFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id })
    .populate("trip")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    favorites,
  });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid favorite id");
  }

  const favorite = await Favorite.findById(id);

  if (!favorite) {
    res.status(404);
    throw new Error("Favorite not found");
  }

  if (favorite.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to remove this favorite");
  }

  await favorite.deleteOne();

  res.status(200).json({
    success: true,
    message: "Removed from favorites",
    favoriteId: id,
  });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const { tripId: rawTripId, from, to, boardingDate } = req.body;
  const tripId = sanitizeTripId(rawTripId);
  const userId = req.user._id;

  let payload = {
    trip: null,
    from: normalizeRoute(from),
    to: normalizeRoute(to),
    boardingDate: boardingDate || undefined,
  };

  if (tripId) {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      res.status(404);
      throw new Error("Trip not found");
    }

    payload = {
      trip: trip._id,
      from: normalizeRoute(trip.from),
      to: normalizeRoute(trip.to),
      boardingDate: trip.journeyDate,
    };
  } else if (!payload.from || !payload.to) {
    res.status(400);
    throw new Error("Please provide tripId or from/to");
  }

  const existing = await Favorite.findOne(
    buildFavoriteQuery({
      userId,
      tripId: payload.trip,
      from: payload.from,
      to: payload.to,
    })
  );

  if (existing) {
    await existing.deleteOne();
    return res.status(200).json({
      success: true,
      action: "removed",
      message: "Removed from favorites",
      favoriteId: existing._id,
    });
  }

  const created = await Favorite.create({
    user: userId,
    ...payload,
  });
  const populatedFavorite = await Favorite.findById(created._id).populate("trip");

  res.status(201).json({
    success: true,
    action: "added",
    message: "Added to favorites",
    favorite: populatedFavorite,
  });
});

export const checkFavoriteStatus = asyncHandler(async (req, res) => {
  const tripId = sanitizeTripId(req.params.tripId);
  if (!tripId) {
    res.status(400);
    throw new Error("Invalid trip id");
  }

  const favorite = await Favorite.findOne({
    user: req.user._id,
    trip: tripId,
  });

  res.status(200).json({
    success: true,
    isFavorite: Boolean(favorite),
    favoriteId: favorite?._id || null,
  });
});
