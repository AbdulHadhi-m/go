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
  // Run every minute
  cron.schedule("* * * * *", async () => {
    await performStatusSweep();
  });

  // Run once immediately on startup
  performStatusSweep();

  console.log("Registered statusCron background worker.");
};

export const performStatusSweep = async () => {
  try {
    console.log("[🗓️ Auto-Sweeper] Running status update check...");
    
    const now = dayjs();

    // Find all scheduled/live trips
    const activeTrips = await Trip.find({
      tripStatus: { $in: ["scheduled", "live"] },
    });

    const pastTrips = activeTrips.filter((trip) => {
      if (!trip.journeyDate || !trip.arrivalTime) return false;

      const datePart = dayjs(trip.journeyDate);
      const timeStr = trip.arrivalTime.trim();
      const match12h = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      const match24h = timeStr.match(/^(\d{1,2}):(\d{2})$/);

      let hours = 0;
      let minutes = 0;

      if (match12h) {
        hours = parseInt(match12h[1], 10);
        minutes = parseInt(match12h[2], 10);
        const ampm = match12h[3].toUpperCase();
        if (hours === 12) hours = 0;
        if (ampm === "PM") hours += 12;
      } else if (match24h) {
        hours = parseInt(match24h[1], 10);
        minutes = parseInt(match24h[2], 10);
      } else {
        return false;
      }

      let arrivalDate = datePart.hour(hours).minute(minutes).second(0);

      // Handle overnight trips
      if (trip.departureTime) {
        const depStr = trip.departureTime.trim();
        const depMatch12h = depStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        const depMatch24h = depStr.match(/^(\d{1,2}):(\d{2})$/);
        let depH = 0;
        let depM = 0;

        if (depMatch12h) {
          depH = parseInt(depMatch12h[1], 10);
          depM = parseInt(depMatch12h[2], 10);
          if (depH === 12) depH = 0;
          if (depMatch12h[3].toUpperCase() === "PM") depH += 12;
        } else if (depMatch24h) {
          depH = parseInt(depMatch24h[1], 10);
          depM = parseInt(depMatch24h[2], 10);
        }

        if (hours < depH || (hours === depH && minutes < depM)) {
          arrivalDate = arrivalDate.add(1, "day");
        }
      }

      return arrivalDate.isBefore(now);
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
