import cron from "node-cron";
import Trip from "../models/tripModel.js";
import Booking from "../models/bookingModel.js";
import { issueRewardForCompletedBooking } from "../services/rewardService.js";
import dayjs from "dayjs";

/**
 * Automatically sweeps scheduled/live trips that are past their Journey Date
 * and marks them, and their related bookings as 'completed'
 */
export const startStatusSweepCron = () => {
  // Run every hour at minute 0
  cron.schedule("0 * * * *", async () => {
    await performStatusSweep();
  });

  // Run once immediately on startup
  performStatusSweep();

  console.log("Registered statusCron background worker.");
};

export const performStatusSweep = async () => {
  try {
    console.log("[🗓️ Auto-Sweeper] Running status update check...");
    
    // Any trip where journeyDate is in the past compared to right now
    const now = dayjs().toDate();

    // Find all scheduled/live trips that are strictly in the past
    const pastTrips = await Trip.find({
      tripStatus: { $in: ["scheduled", "live"] },
      journeyDate: { $lt: now },
    });

      if (pastTrips.length === 0) {
        return; // Nothing to update
      }

      console.log(`[🗓️ Auto-Sweeper] Found ${pastTrips.length} past trip(s). Marking as completed.`);

      const tripIds = pastTrips.map((trip) => trip._id);

      // 1. Mark the Trips themselves as completed
      await Trip.updateMany(
        { _id: { $in: tripIds } },
        { $set: { tripStatus: "completed" } }
      );

      // 2. Find and update corresponding confirmed bookings as completed
      const bookings = await Booking.find({ 
        trip: { $in: tripIds }, 
        bookingStatus: "confirmed" 
      });

      let updatedCount = 0;
      for (const booking of bookings) {
        booking.bookingStatus = "completed";
        await booking.save();
        updatedCount++;

        // Issue rewards for each completed booking
        try {
          await issueRewardForCompletedBooking(booking._id);
        } catch (error) {
          console.error(`[❌ Auto-Sweeper] Failed to issue reward for booking ${booking._id}:`, error.message);
        }
      }

    console.log(`[✅ Auto-Sweeper] Marked ${updatedCount} booking(s) as completed and processed rewards.`);
  } catch (error) {
    console.error("[❌ Auto-Sweeper] Error updating past trips and bookings:", error.message);
  }
};
