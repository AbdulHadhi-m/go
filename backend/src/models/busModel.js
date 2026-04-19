import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    busNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      default: "AC Sleeper",
      trim: true,
    },
    totalSeats: {
      type: Number,
      default: 40,
      min: 1,
    },
    fare: {
      type: Number,
      default: 900,
      min: 0,
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    maintenanceStatus: {
      type: String,
      enum: ["active", "maintenance"],
      default: "active",
    },
    driver: {
      name: { type: String, default: "", trim: true },
      phone: { type: String, default: "", trim: true },
      licenseNo: { type: String, default: "", trim: true },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Bus = mongoose.model("Bus", busSchema);

export default Bus;
