import crypto from "crypto";
import asyncHandler from "express-async-handler";
import razorpay from "../config/razorpay.js";
import Booking from "../models/bookingModel.js";
import Payment from "../models/paymentModel.js";
import Trip from "../models/tripModel.js";
import Coupon from "../models/couponModel.js";

// POST /api/payments/create-order
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Valid amount is required");
  }

  const options = {
    amount: Math.round(amount * 100), // INR -> paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  res.status(201).json(order);
});

// POST /api/payments/verify
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    orderCreationId, // our server order.id
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    tripId,
    seats,
    totalAmount,
    passengerDetails,
    couponCode = null,
    discountAmount = 0,
    originalAmount = totalAmount,
    finalAmount = totalAmount,
    offerApplied = "",
    offerType = "none",
    offerMeta = {},
    firstBookingOfferUsed = false,
  } = req.body;

  if (
    !orderCreationId ||
    !razorpay_payment_id ||
    !razorpay_order_id ||
    !razorpay_signature ||
    !tripId ||
    !Array.isArray(seats) ||
    seats.length === 0
  ) {
    res.status(400);
    throw new Error("Missing payment verification data");
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderCreationId}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error("Invalid payment signature");
  }

  const trip = await Trip.findById(tripId);
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const seatAlreadyBooked = seats.some((seat) => trip.bookedSeats.includes(seat));
  if (seatAlreadyBooked) {
    res.status(400);
    throw new Error("One or more selected seats are already booked");
  }

  const booking = await Booking.create({
    user: req.user._id,
    trip: tripId,
    seats,
    totalAmount,
    originalAmount,
    finalAmount,
    discountAmount,
    couponCode: couponCode ? String(couponCode).toUpperCase() : null,
    offerApplied,
    offerType,
    offerMeta,
    firstBookingOfferUsed,
    couponUsageCounted: false,
    paidAmount: totalAmount,
    passengerDetails: passengerDetails || [],
    bookingStatus: "confirmed",
    paymentStatus: "paid",
  });

  trip.bookedSeats.push(...seats);
  trip.availableSeats -= seats.length;
  await trip.save();

  await Payment.create({
    user: req.user._id,
    booking: booking._id,
    amount: totalAmount,
    paymentMethod: "Razorpay",
    paymentStatus: "paid",
    transactionId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });

  if (booking.couponCode && booking.offerType === "coupon" && !booking.couponUsageCounted) {
    await Coupon.findOneAndUpdate(
      {
        code: booking.couponCode,
        ...(booking.offerMeta?.couponId ? { _id: booking.offerMeta.couponId } : {}),
      },
      { $inc: { usedCount: 1 } }
    );
    booking.couponUsageCounted = true;
    await booking.save();
  }

  const populatedBooking = await Booking.findById(booking._id)
    .populate("trip")
    .populate("user", "name email");

  res.status(200).json({
    success: true,
    message: "Payment verified and booking created successfully",
    booking: populatedBooking,
  });
});