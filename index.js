import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import http from "http"; // Import HTTP
import { Server } from "socket.io"; // Import Socket.IO
import errorHandler from "./middlewares/errorHandler.js";
import connectDB from "./config/database.js"; // ✅ MongoDB connection

// ✅ Import Routes
import authRoute from "./routes/AuthRoutes.js";
import messageRoute from "./routes/messageRoute.js";
import AlumniRoute from "./routes/alumniRoutes.js";
import JobRoute from "./routes/JobRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import ProjectRoute from "./routes/projectRoutes.js";
import autoJobRoutes from "./routes/autoJobRoutes.js";
import MentorRoutes from "./routes/mentorRoutes.js";
import BlogRoutes from "./routes/BlogRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";


// ✅ Import Socket items
import socketAuthMiddleware from "./middlewares/socketAuthMiddleware.js";
import { socketHandler } from "./socket/socketHandler.js";

import JobScheduler from "./services/jobScheduler.js";

// Load ENV
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Create HTTP Server
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "http://localhost:5173",
      "https://alumni-mits.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// ✅ Socket Middleware & Handling
io.use(socketAuthMiddleware);
io.on("connection", socketHandler(io));

// ✅ CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "http://localhost:5173",
      "https://alumni-mits.vercel.app",
    ],
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

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ✅ Home Route
app.get("/", (req, res) => {
  res.send("✅ Alumni MITS Backend is running with MongoDB & Socket.IO!");
});

// ✅ API Routes
app.use("/auth", authRoute);
app.use("/message", messageRoute);
app.use("/alumni", AlumniRoute);
app.use("/job", JobRoute);
app.use("/event", eventRoutes);
app.use("/campaign", campaignRoutes);
app.use("/project", ProjectRoute);
app.use("/mentor", MentorRoutes);
app.use("/api/blogs", BlogRoutes);
app.use("/api/jobs", JobRoute);
app.use("/notification", notificationRoutes);

app.use("/api/auto-jobs", autoJobRoutes);

// Start the automated scheduler
JobScheduler.start();
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
// ✅ Global Error Handler
app.use(errorHandler);

// ✅ Start Server (Use `server` instead of `app`)
const startServer = async () => {
  try {
    console.log("🔄 Starting server...");

    // ✅ Connect to MongoDB
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
      console.log("✅ MongoDB Connected");
      console.log("✅ Socket.IO Initialized");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
