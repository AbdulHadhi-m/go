import mongoose from "mongoose";

const rewardTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    type: {
      type: String,
      enum: ["EARN", "REDEEM", "EXPIRE", "REFUND"],
      required: true,
    },
    coins: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
rewardTransactionSchema.index({ user: 1, createdAt: -1 });

// Unique index for EARN type to prevent duplicate rewards for same booking
rewardTransactionSchema.index(
  { booking: 1, type: 1 },
  { 
    unique: true, 
    partialFilterExpression: { type: "EARN", booking: { $exists: true, $ne: null } } 
  }
);

const RewardTransaction = mongoose.model("RewardTransaction", rewardTransactionSchema);

export default RewardTransaction;
