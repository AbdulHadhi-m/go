import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    review: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    helpful: {
      count: {
        type: Number,
        default: 0,
      },
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
  },
  { timestamps: true }
);

// Prevent user from reviewing the same booking twice
reviewSchema.index({ user: 1, booking: 1 }, { unique: true });

// Static method to calculate the average rating for a bus
reviewSchema.statics.calculateAverageRating = async function (busId) {
  const obj = await this.aggregate([
    {
      $match: { bus: busId },
    },
    {
      $group: {
        _id: "$bus",
        averageRating: { $avg: "$rating" },
        numberOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await mongoose.model("Bus").findByIdAndUpdate(busId, {
      averageRating: obj.length > 0 ? obj[0].averageRating : 0,
      numberOfReviews: obj.length > 0 ? obj[0].numberOfReviews : 0,
    });
  } catch (error) {
    console.error("Failed to update Bus ratings:", error);
  }
};

const Review = mongoose.model("Review", reviewSchema);

export default Review;
