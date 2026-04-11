import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      default: null,
    },
    busName: {
      type: String,
      required: true,
    },
    busType: {
      type: String,
      default: "AC Sleeper",
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    journeyDate: {
      type: Date,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    seatPrice: {
      type: Number,
      default: 0,
    },
    dynamicPricingEnabled: {
      type: Boolean,
      default: true,
    },
    weekendMultiplier: {
      type: Number,
      default: 1.1,
      min: 1,
    },
    offers: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        discountType: {
          type: String,
          enum: ["percentage", "flat"],
          default: "percentage",
        },
        discountValue: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
      },
    ],
    boardingPoints: [
      {
        name: { type: String, trim: true },
        time: { type: String, trim: true },
      },
    ],
    tripStatus: {
      type: String,
      enum: ["scheduled", "live", "completed", "cancelled"],
      default: "scheduled",
    },
    cancelledReason: {
      type: String,
      default: "",
      trim: true,
    },
    totalSeats: {
      type: Number,
      default: 40,
    },
    availableSeats: {
      type: Number,
      default: 40,
    },
    bookedSeats: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;