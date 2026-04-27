import Trip from "../models/tripModel.js";
import Coupon from "../models/couponModel.js";
import CouponUsage from "../models/couponUsageModel.js";
import { redeemCoinsForBooking } from "./rewardService.js";

export const finalizeBookingOperations = async (booking, trip, coinsToUse, reqUser) => {
  // Deduct coins if they were used
  if (coinsToUse > 0) {
    await redeemCoinsForBooking(reqUser._id, booking._id, coinsToUse);
  }

  // Update trip seats
  trip.bookedSeats.push(...booking.seats);
  trip.availableSeats -= booking.seats.length;
  await trip.save();

  // Update coupon usage
  if (booking.couponCode && booking.offerType === "coupon" && !booking.couponUsageCounted) {
    const couponDoc = await Coupon.findOneAndUpdate(
      {
        code: booking.couponCode,
        ...(booking.offerMeta?.couponId ? { _id: booking.offerMeta.couponId } : {}),
      },
      { $inc: { usedCount: 1 } },
      { new: true }
    );
    
    if (couponDoc) {
      booking.appliedCoupon = couponDoc._id;
      await CouponUsage.create({
        user: reqUser._id,
        coupon: couponDoc._id,
        booking: booking._id,
      });
    }

    booking.couponUsageCounted = true;
    await booking.save();
  }
};
