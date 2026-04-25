import Trip from "../models/tripModel.js";
import { evaluateOffer } from "../controllers/couponController.js";

// Reusable service to recalculate everything reliably in the backend
export const calculateSecureTotals = async (tripId, seatsCount, couponCode, userId, boardingPointId, droppingPointId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw new Error("Trip not found");
  }

  // Same logic as frontend CheckoutPage.jsx
  const boardingPt = trip.boardingPoints.find(p => p._id.toString() === boardingPointId);
  const droppingPt = trip.droppingPoints.find(p => p._id.toString() === droppingPointId);

  const boardingExtra = boardingPt?.extraFare || 0;
  const droppingExtra = droppingPt?.extraFare || 0;

  const baseFare = (trip.fare + boardingExtra + droppingExtra) * seatsCount;
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
    boardingPoint: boardingPt,
    droppingPoint: droppingPt,
    ...result, // { selectedOffer, manualError, manualCoupon, autoOffer, finalAmount, discountAmount }
  };
};
