import asyncHandler from "express-async-handler";
import Review from "../models/reviewModel.js";
import Booking from "../models/bookingModel.js";
import Bus from "../models/busModel.js";
import Joi from "joi";

const reviewSchema = Joi.object({
  bookingId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  title: Joi.string().max(100).trim().required(),
  review: Joi.string().max(500).trim().required(),
});

// @desc Create a new review
// @route POST /api/reviews
// @access Private
export const addReview = asyncHandler(async (req, res) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { bookingId, rating, title, review } = req.body;

  // 1. Find the booking explicitly populated with trip data
  const booking = await Booking.findById(bookingId).populate("trip");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // 2. Validate booking belongs to logged-in user
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to review this booking");
  }

  // 3. Validate booking is "completed"
  if (booking.bookingStatus !== "completed") {
    res.status(400);
    throw new Error("Only completed bookings can be reviewed");
  }

  // 4. Validate travel date/time has passed (Trip arrivalTime or journeyDate)
  if (booking.trip && booking.trip.journeyDate) {
    const tripDate = new Date(booking.trip.journeyDate);
    const currentDate = new Date();

    // Safety check just to be entirely strict per user requirement
    if (tripDate > currentDate) {
      res.status(400);
      throw new Error("Cannot review a journey that has not yet occurred");
    }
  }

  // 5. Check duplicate review for { user, booking }
  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    booking: bookingId,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this booking");
  }

  // 6. Get busId
  let busId = booking.trip?.bus;

  if (!busId && booking.trip) {
    const busName = booking.trip.busName?.trim();
    const operatorId = booking.trip.operator;

    // Multi-stage fallback search
    if (busName || operatorId) {
      const escapedBusName = busName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Stage A: Case-insensitive name match for the same operator
      let fallbackBus = null;
      if (busName && operatorId) {
        fallbackBus = await Bus.findOne({
          operator: operatorId,
          name: { $regex: new RegExp(`^${escapedBusName}$`, "i") },
        });
      }

      // Stage B: Global case-insensitive name match (if name unique enough)
      if (!fallbackBus && busName) {
        fallbackBus = await Bus.findOne({
          name: { $regex: new RegExp(`^${escapedBusName}$`, "i") },
        });
      }

      // Stage C: Assign to any active bus from the same operator (as last resort)
      if (!fallbackBus && operatorId) {
        fallbackBus = await Bus.findOne({ operator: operatorId });
      }

      if (fallbackBus) {
        busId = fallbackBus._id;
        // Auto-fix the trip record for future use
        booking.trip.bus = fallbackBus._id;
        await booking.trip.save();
      }
    }
  }

  if (!busId) {
    res.status(400);
    throw new Error(
      "This booking trip is not linked to a specific bus vehicle. Only trips with verified bus associations can be reviewed."
    );
  }

  // 7. Create review
  const newReview = await Review.create({
    user: req.user._id,
    bus: busId,
    booking: bookingId,
    rating,
    title,
    review,
  });

  // 8 & 9. Recalculate average rating & update Bus Summary
  await Review.calculateAverageRating(busId);

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    data: newReview,
  });
});

// @desc Get all reviews for a bus
// @route GET /api/reviews/bus/:busId
// @access Public
export const getBusReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ bus: req.params.busId })
    .populate("user", "firstName lastName avatar profileImage")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc Mark a review as helpful
// @route PUT /api/reviews/:id/helpful
// @access Private
export const markHelpfulReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.id;

  const review = await Review.findById(reviewId);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Check if user already marked it as helpful
  if (review.helpful.users.includes(req.user._id)) {
    res.status(400);
    throw new Error("You have already marked this review as helpful");
  }

  // Cannot mark own review as helpful (optional, but logical practice)
  if (review.user.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot mark your own review as helpful");
  }

  review.helpful.users.push(req.user._id);
  review.helpful.count = review.helpful.users.length;

  await review.save();

  res.status(200).json({
    success: true,
    message: "Review marked as helpful",
    helpfulCount: review.helpful.count,
  });
});

// @desc Delete a review
// @route DELETE /api/reviews/:id
// @access Private
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Owner or Admin only
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  const busId = review.bus;

  await Review.deleteOne({ _id: req.params.id });

  // Recalculate average rating & update Bus
  await Review.calculateAverageRating(busId);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
