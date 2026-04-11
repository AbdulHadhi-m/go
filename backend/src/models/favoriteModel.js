import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },
    from: {
      type: String,
      required: true,
      trim: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
    },
    boardingDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

favoriteSchema.index(
  { user: 1, trip: 1 },
  {
    unique: true,
    partialFilterExpression: {
      trip: { $type: "objectId" },
    },
  }
);

favoriteSchema.index(
  { user: 1, from: 1, to: 1 },
  {
    unique: true,
    partialFilterExpression: {
      trip: null,
    },
  }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
