import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const db = mongoose.connection.db;
    const trips = await db.collection('trips').find({}).toArray();
    
    console.log("First trip journeyDate:");
    console.log("Value:", trips[0].journeyDate);
    console.log("Type:", typeof trips[0].journeyDate);
    console.log("Is Date object?", trips[0].journeyDate instanceof Date);
    
    // Check if there are any results for date `2026-04-08`
    const date = "2026-08-04"; // Let's check what they actually searched for! 
    const start = new Date(date);
    const end = new Date(date);
    end.setUTCDate(end.getUTCDate() + 1);

    const filter = {
      journeyDate: {
        $gte: start,
        $lt: end,
      }
    };
    const c1 = await db.collection('trips').find(filter).toArray();
    console.log(`Raw matches for ${date}:`, c1.length);
    
    const date2 = "2026-04-08"; 
    const start2 = new Date(date2);
    const end2 = new Date(date2);
    end2.setUTCDate(end2.getUTCDate() + 1);
    const c2 = await db.collection('trips').find({ journeyDate: { $gte: start2, $lt: end2} }).toArray();
    console.log(`Raw matches for ${date2}:`, c2.length);

    process.exit(0);
});
