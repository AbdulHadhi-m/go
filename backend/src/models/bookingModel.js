import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    seats: [
      {
        type: String,
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    originalAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: null,
      uppercase: true,
      trim: true,
    },
    appliedCoupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    offerApplied: {
      type: String,
      default: "",
      trim: true,
    },
    offerType: {
      type: String,
      enum: ["none", "coupon", "first_booking_auto"],
      default: "none",
    },
    offerMeta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    firstBookingOfferUsed: {
      type: Boolean,
      default: false,
    },
    couponUsageCounted: {
      type: Boolean,
      default: false,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partial_refunded"],
      default: "paid",
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    cancellationCharge: {
      type: Number,
      default: 0,
    },
    refundStatus: {
      type: String,
      enum: ["not_applicable", "pending", "processed", "failed"],
      default: "not_applicable",
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: "",
      trim: true,
    },
    paymentMethod: {
      type: String,
      default: "UPI",
    },
    rewardGiven: {
      type: Boolean,
      default: false,
    },
    coinsUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;