import * as dotenv from "dotenv";
import express, { json, response } from "express";
import { connectDB, sequelize } from "./config/database.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoute from "./routes/AuthRoutes.js";
import messageRoute from "./routes/messageRoute.js";
import AlumniRoute from "./routes/alumniRoutes.js";
import JobRoute from "./routes/JobRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import ProjectRoute from "./routes/projectRoutes.js";
import JobScheduler from "./services/jobScheduler.js";
import autoJobRoutes from "./routes/autoJobRoutes.js";
import MentorRoutes from "./routes/mentorRoutes.js";

import helmet from "helmet";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - FIX 1: Specify exact origins
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "http://localhost:5173",
      "https://alumni-mits.vercel.app",
    ], // Add your frontend URLs
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
  })
);

// Middleware - FIX 2: Correct order
app.use(json());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Move this up before routes
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // FIX 3: Allow cross-origin resources
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Alumni MITS Backed is running...");
});
app.use("/auth", authRoute);
app.use("/message", messageRoute);
app.use("/alumni", AlumniRoute);
app.use("/job", JobRoute);
app.use("/event", eventRoutes);
app.use("/campaign", campaignRoutes);
app.use("/project", ProjectRoute);
app.use("/mentor", MentorRoutes);
// Start the automated scheduler
JobScheduler.start();

// Routes
app.use("/api/jobs", JobRoute);
app.use("/api/auto-jobs", autoJobRoutes); // For manual triggers

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  JobScheduler.stop();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  JobScheduler.stop();
  process.exit(0);
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Clean server startup
const startServer = async () => {
  try {
    console.log("🔄 Starting server...");

    // Connect to database
    await connectDB();
    //await seed();

    // Sync database
    await sequelize.sync();
    //await sequelize.sync({ force: true });

    // Start server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
