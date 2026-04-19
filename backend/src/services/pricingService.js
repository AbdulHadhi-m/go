import Trip from "../models/tripModel.js";
import { evaluateOffer } from "../controllers/couponController.js";

// Reusable service to recalculate everything reliably in the backend
export const calculateSecureTotals = async (tripId, seatsCount, couponCode, userId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw new Error("Trip not found");
  }

  // Same logic as frontend CheckoutPage.jsx
  const baseFare = trip.fare * seatsCount;
  const tax = Math.round(baseFare * 0.05);
  const baseDiscount = 100; // Built-in platform discount
  
  const amountBeforeOffer = Math.max(0, baseFare + tax - baseDiscount);

  // Revalidate coupon and evaluate offer securely
  const result = await evaluateOffer({
    userId,
    amount: amountBeforeOffer,
    code: couponCode,
    trip,
  });

  if (couponCode && result.manualError && !result.autoOffer) {
    throw new Error(result.manualError);
  }

  return {
    trip,
    baseFare,
    tax,
    baseDiscount,
    amountBeforeOffer,
    ...result, // { selectedOffer, manualError, manualCoupon, autoOffer, finalAmount, discountAmount }
  };
};
