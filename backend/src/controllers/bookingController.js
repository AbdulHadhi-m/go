import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import Trip from "../models/tripModel.js";
import Coupon from "../models/couponModel.js";
import CouponUsage from "../models/couponUsageModel.js";
import User from "../models/userModel.js";
import { calculateSecureTotals } from "../services/pricingService.js";
import { calculateRedeemableCoins } from "../utils/rewardUtils.js";
import { redeemCoinsForBooking } from "../services/rewardService.js";

const parseDepartureDateTime = (journeyDate, departureTime) => {
  if (!journeyDate || !departureTime) return null;

  const datePart = new Date(journeyDate);
  if (Number.isNaN(datePart.getTime())) return null;

  const time = String(departureTime).trim();
  const match12h = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  const match24h = time.match(/^(\d{1,2}):(\d{2})$/);

  let hours;
  let minutes;

  if (match12h) {
    hours = Number(match12h[1]);
    minutes = Number(match12h[2]);
    const ampm = match12h[3].toUpperCase();
    if (hours === 12) hours = 0;
    if (ampm === "PM") hours += 12;
  } else if (match24h) {
    hours = Number(match24h[1]);
    minutes = Number(match24h[2]);
  } else {
    return null;
  }

  if (hours > 23 || minutes > 59) return null;

  return new Date(
    datePart.getFullYear(),
    datePart.getMonth(),
    datePart.getDate(),
    hours,
    minutes,
    0,
    0
  );
};

export const createBooking = asyncHandler(async (req, res) => {
  const {
    tripId,
    seats,
    passengerDetails,
    paymentMethod,
    couponCode = null,
    redeemCoins = 0,
  } = req.body;

  if (!tripId || !Array.isArray(seats) || seats.length === 0) {
    res.status(400);
    throw new Error("Please provide all required booking details");
  }

  const trip = await Trip.findById(tripId);

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const alreadyBooked = seats.some((seat) => trip.bookedSeats.includes(seat));
  if (alreadyBooked) {
    res.status(400);
    throw new Error("One or more selected seats are already booked");
  }

  if (trip.availableSeats < seats.length) {
    res.status(400);
    throw new Error("Not enough seats available");
  }

  const securePricing = await calculateSecureTotals(tripId, seats.length, couponCode, req.user._id);

  // Reward Redemption Logic
  let coinsToUse = 0;
  let rewardDiscount = 0;

  if (redeemCoins > 0) {
    const user = await User.findById(req.user._id);
    const availableCoins = user.rewardCoins || 0;
    
    // Calculate max possible redemption for this total
    const maxRedeemable = calculateRedeemableCoins(availableCoins, securePricing.finalAmount);
    
    // Use the minimum of (requested, available, maxAllowed)
    coinsToUse = Math.min(Number(redeemCoins), maxRedeemable);
    rewardDiscount = coinsToUse; // 1 coin = 1 unit currency
  }

  const finalPayableAmount = Math.max(0, securePricing.finalAmount - rewardDiscount);

  const booking = await Booking.create({
    user: req.user._id,
    trip: tripId,
    seats,
    totalAmount: securePricing.finalAmount,
    originalAmount: securePricing.amountBeforeOffer,
    finalAmount: finalPayableAmount,
    discountAmount: securePricing.discountAmount + rewardDiscount,
    coinsUsed: coinsToUse,
    couponCode: securePricing.selectedOffer?.couponCode || null,
    offerApplied: securePricing.selectedOffer?.offerApplied || "",
    offerType: securePricing.selectedOffer?.offerType || "none",
    offerMeta: securePricing.selectedOffer?.offerMeta || {},
    firstBookingOfferUsed: securePricing.selectedOffer?.offerType === "first_booking_auto",
    couponUsageCounted: false,
    paidAmount: finalPayableAmount,
    paymentMethod: paymentMethod || "UPI",
    passengerDetails: passengerDetails || [],
    bookingStatus: "confirmed",
    paymentStatus: "paid",
    refundStatus: "not_applicable",
  });

  // Deduct coins if they were used
  if (coinsToUse > 0) {
    await redeemCoinsForBooking(req.user._id, booking._id, coinsToUse);
  }

  trip.bookedSeats.push(...seats);
  trip.availableSeats -= seats.length;

  await trip.save();

  if (booking.couponCode && booking.offerType === "coupon" && !booking.couponUsageCounted) {
    const couponDoc = await Coupon.findOneAndUpdate(
      {
        code: booking.couponCode,
        ...(booking.offerMeta?.couponId ? { _id: booking.offerMeta.couponId } : {}),
      },
      { $inc: { usedCount: 1 } },
      { new: true }
    );
    
    if (couponDoc) {
      booking.appliedCoupon = couponDoc._id;
      await CouponUsage.create({
        user: req.user._id,
        coupon: couponDoc._id,
        booking: booking._id,
      });
    }

    booking.couponUsageCounted = true;
    await booking.save();
  }

  const populatedBooking = await Booking.findById(booking._id)
    .populate("trip")
    .populate("user", "firstName lastName email");

  res.status(201).json(populatedBooking);
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("trip")
    .populate("user", "firstName lastName email")
    .sort({ createdAt: -1 });

  res.status(200).json(bookings);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { cancellationReason } = req.body || {};

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid booking id");
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const isOwner = booking.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("Not authorized to cancel this booking");
  }

  if (booking.bookingStatus === "cancelled") {
    res.status(400);
    throw new Error("Booking already cancelled");
  }

  const trip = await Trip.findById(booking.trip);
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found for this booking");
  }

  const departureDateTime = parseDepartureDateTime(
    trip.journeyDate,
    trip.departureTime
  );
  if (!departureDateTime) {
    res.status(400);
    throw new Error("Unable to determine departure schedule for cancellation");
  }

  const now = new Date();
  const msUntilDeparture = departureDateTime.getTime() - now.getTime();
  const hoursUntilDeparture = msUntilDeparture / (1000 * 60 * 60);

  if (hoursUntilDeparture < 2) {
    res.status(400);
    throw new Error(
      "Cancellation is allowed only up to 2 hours before departure"
    );
  }

  const paidAmount = Number(booking.paidAmount || booking.totalAmount || 0);
  let cancellationPolicyApplied = "no_refund_unpaid";
  let cancellationCharge = 0;
  let refundAmount = 0;
  let refundStatus = "not_applicable";
  let paymentStatus = booking.paymentStatus;

  if (booking.paymentStatus === "paid") {
    if (hoursUntilDeparture > 24) {
      cancellationPolicyApplied = "full_refund_before_24_hours";
      cancellationCharge = 0;
      refundAmount = paidAmount;
      paymentStatus = "refunded";
    } else {
      cancellationPolicyApplied = "ten_percent_charge_within_24_hours";
      cancellationCharge = Number((paidAmount * 0.1).toFixed(2));
      refundAmount = Number((paidAmount - cancellationCharge).toFixed(2));
      paymentStatus = "partial_refunded";
    }
    refundStatus = "pending";
  }

  booking.bookingStatus = "cancelled";
  booking.cancelledAt = new Date();
  booking.cancellationReason = String(
    cancellationReason || booking.cancellationReason || "Cancelled by user"
  ).trim();
  booking.cancellationCharge = cancellationCharge;
  booking.refundAmount = refundAmount;
  booking.refundStatus = refundStatus;
  booking.paymentStatus = paymentStatus;

  if (Array.isArray(booking.seats) && booking.seats.length > 0) {
    trip.bookedSeats = trip.bookedSeats.filter(
      (seat) => !booking.seats.includes(seat)
    );
    trip.availableSeats = Math.min(
      trip.totalSeats,
      trip.availableSeats + booking.seats.length
    );
  }

  await trip.save();
  await booking.save();

  res.status(200).json({
    message: "Booking cancelled successfully",
    cancellationPolicyApplied,
    refundAmount: booking.refundAmount,
    cancellationCharge: booking.cancellationCharge,
    refundStatus: booking.refundStatus,
    bookingStatus: booking.bookingStatus,
    booking,
  });
});