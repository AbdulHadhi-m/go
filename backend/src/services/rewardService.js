import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import RewardTransaction from "../models/rewardTransactionModel.js";
import { calculateRewardCoins } from "../utils/rewardUtils.js";

/**
 * Issue reward coins for a completed booking
 * @param {string} bookingId - The ID of the completed booking
 */
export const issueRewardForCompletedBooking = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Conditions: completed, paid, not cancelled, and reward not already given
    if (
      (booking.bookingStatus === "completed" || booking.bookingStatus === "confirmed") &&
      booking.paymentStatus === "paid" &&
      booking.bookingStatus !== "cancelled" &&
      booking.rewardGiven === false
    ) {
      const coinsToEarn = calculateRewardCoins(booking.totalAmount);

      if (coinsToEarn > 0) {
        const user = await User.findById(booking.user);
        if (!user) {
          throw new Error("User not found");
        }

        // Add coins to user
        user.rewardCoins = (user.rewardCoins || 0) + coinsToEarn;
        await user.save();

        // Create reward transaction
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 180); // 180 days from now

        await RewardTransaction.create({
          user: user._id,
          booking: booking._id,
          type: "EARN",
          coins: coinsToEarn,
          balanceAfter: user.rewardCoins,
          description: "Reward coins earned for completed trip",
          expiresAt,
        });

        // Mark reward as given in booking
        booking.rewardGiven = true;
        await booking.save();
      }

      return { success: true, coinsEarned: coinsToEarn };
    }

    return { success: false, message: "Conditions not met for reward" };
  } catch (error) {
    console.error("Error issuing reward:", error);
    // Handle duplicate reward transaction error safely
    if (error.code === 11000) {
      return { success: false, message: "Reward already issued" };
    }
    throw error;
  }
};

/**
 * Deduct reward coins when used for booking discount
 * @param {string} userId - User ID
 * @param {string} bookingId - Booking ID
 * @param {number} coinsToRedeem - Number of coins to deduct
 */
export const redeemCoinsForBooking = async (userId, bookingId, coinsToRedeem) => {
  if (!coinsToRedeem || coinsToRedeem <= 0) return null;

  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if ((user.rewardCoins || 0) < coinsToRedeem) {
      throw new Error("Insufficient reward coins balance");
    }

    // Deduct coins
    user.rewardCoins -= coinsToRedeem;
    await user.save();

    // Create transaction record
    const transaction = await RewardTransaction.create({
      user: userId,
      booking: bookingId,
      type: "REDEEM",
      coins: -coinsToRedeem,
      balanceAfter: user.rewardCoins,
      description: "Coins used for booking discount",
    });

    return transaction;
  } catch (error) {
    console.error("Error redeeming coins:", error);
    throw error;
  }
};
