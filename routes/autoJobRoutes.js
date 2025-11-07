import express from "express";
import JobScheduler from "../services/jobScheduler.js";
import AutoJobService from "../services/autoJobService.js";

const router = express.Router();

// Manual trigger for scraping
router.post("/scrape-now", async (req, res) => {
  try {
    console.log("📡 API: Manual scraping request received");
    const result = await JobScheduler.triggerScraping();

    if (result.success) {
      res.json({
        success: true,
        message: "Job scraping completed successfully",
        data: result.results,
        duration: result.duration,
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message || "Scraping failed",
        error: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Scraping failed",
      error: error.message,
    });
  }
});

// Manual trigger for cleanup
router.post("/cleanup-now", async (req, res) => {
  try {
    console.log("📡 API: Manual cleanup request received");
    const result = await JobScheduler.triggerCleanup();

    if (result.success) {
      res.json({
        success: true,
        message: "Cleanup completed successfully",
        data: {
          expiredCount: result.expiredCount,
          deletedCount: result.deletedCount,
        },
        duration: result.duration,
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message || "Cleanup failed",
        error: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cleanup failed",
      error: error.message,
    });
  }
});

// Manual trigger for status update
router.post("/update-status-now", async (req, res) => {
  try {
    console.log("📡 API: Manual status update request received");
    const result = await JobScheduler.triggerStatusUpdate();

    if (result.success) {
      res.json({
        success: true,
        message: "Status update completed successfully",
        data: result.result,
        duration: result.duration,
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message || "Status update failed",
        error: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Status update failed",
      error: error.message,
    });
  }
});

// Get scheduler status
router.get("/scheduler-status", (req, res) => {
  try {
    const status = JobScheduler.getStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get scheduler status",
      error: error.message,
    });
  }
});

// Get detailed statistics
router.get("/statistics", (req, res) => {
  try {
    const stats = JobScheduler.getStatistics();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get statistics",
      error: error.message,
    });
  }
});

// Health check endpoint
router.get("/health", async (req, res) => {
  try {
    const health = await JobScheduler.runHealthCheck();
    const statusCode = health.healthy ? 200 : 503;

    res.status(statusCode).json({
      success: health.healthy,
      data: health,
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Health check failed",
      error: error.message,
    });
  }
});

// Restart scheduler (use with caution)
router.post("/restart", (req, res) => {
  try {
    JobScheduler.restart();
    res.json({
      success: true,
      message: "Scheduler restarted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to restart scheduler",
      error: error.message,
    });
  }
});

export default router;
