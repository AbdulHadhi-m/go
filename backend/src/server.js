import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";
import { startNotificationWorker } from "./workers/notificationWorker.js";
import { startStatusSweepCron } from "./workers/statusCron.js";

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Start Background Workers
startNotificationWorker();
startStatusSweepCron();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});