import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
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