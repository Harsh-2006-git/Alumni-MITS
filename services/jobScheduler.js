// services/jobScheduler.js
// ORIGINAL CODE - NO MODIFICATIONS
import cron from "node-cron";
import AutoJobService from "./autoJobService.js";
import Job from "../models/Job.js";
import { Op } from "sequelize";

class JobScheduler {
  constructor() {
    this.isScraping = false;
    this.isCleaning = false;
    this.isUpdating = false;
    this.tasks = [];
    this.stats = {
      lastScrapeTime: null,
      lastCleanupTime: null,
      lastUpdateTime: null,
      totalScrapingRuns: 0,
      totalCleanupRuns: 0,
      errors: [],
    };
  }

  start() {
    console.log("🚀 Starting Automated Job Scheduler...");
    console.log(`📍 Timezone: Asia/Kolkata`);
    console.log(`⏰ Current Time: ${new Date().toLocaleString("en-IN")}`);

    // Schedule 1: Scrape jobs daily at 12:00 AM
    const scrapeTask = cron.schedule(
      "0 0 * * *",
      async () => {
        console.log("\n" + "=".repeat(50));
        console.log("🕛 12:00 AM - Starting daily job scraping...");
        await this.runScraping();
      },
      {
        timezone: "Asia/Kolkata",
        scheduled: true,
      }
    );
    this.tasks.push({ name: "Scraping", task: scrapeTask });

    // Schedule 2: Cleanup expired jobs daily at 12:05 AM
    const cleanupTask = cron.schedule(
      "5 0 * * *",
      async () => {
        console.log("\n" + "=".repeat(50));
        console.log("🕛 12:05 AM - Starting daily job cleanup...");
        await this.runCleanup();
      },
      {
        timezone: "Asia/Kolkata",
        scheduled: true,
      }
    );
    this.tasks.push({ name: "Cleanup", task: cleanupTask });

    // Schedule 3: Update job statuses daily at 12:10 AM
    const updateTask = cron.schedule(
      "10 0 * * *",
      async () => {
        console.log("\n" + "=".repeat(50));
        console.log("🕛 12:10 AM - Updating job statuses...");
        await this.runStatusUpdate();
      },
      {
        timezone: "Asia/Kolkata",
        scheduled: true,
      }
    );
    this.tasks.push({ name: "Status Update", task: updateTask });

    // Schedule 4: Health check every 6 hours
    const healthTask = cron.schedule(
      "0 */6 * * *",
      async () => {
        console.log("🏥 Running health check...");
        await this.runHealthCheck();
      },
      {
        timezone: "Asia/Kolkata",
        scheduled: true,
      }
    );
    this.tasks.push({ name: "Health Check", task: healthTask });

    // Schedule 5: Error log cleanup weekly (Sunday at 2 AM)
    const errorCleanupTask = cron.schedule(
      "0 2 * * 0",
      async () => {
        console.log("🧹 Cleaning up old error logs...");
        this.cleanupErrorLogs();
      },
      {
        timezone: "Asia/Kolkata",
        scheduled: true,
      }
    );
    this.tasks.push({ name: "Error Cleanup", task: errorCleanupTask });

    console.log("✅ Scheduler started successfully!");
    console.log("\n📅 Schedule Summary:");
    console.log("  • Daily at 12:00 AM: Job Scraping");
    console.log("  • Daily at 12:05 AM: Expired Job Cleanup");
    console.log("  • Daily at 12:10 AM: Status Updates");
    console.log("  • Every 6 hours: Health Check");
    console.log("  • Weekly (Sunday 2 AM): Error Log Cleanup");

    // Optional: Run on startup after delay
    if (process.env.RUN_ON_STARTUP === "true") {
      setTimeout(() => {
        console.log("\n🚀 Running initial setup (startup mode)...");
        this.runInitialSetup();
      }, 10000);
    }
  }

  async runInitialSetup() {
    try {
      console.log("🔍 Checking system health...");
      await this.runHealthCheck();

      console.log("📊 Running initial scraping...");
      await this.runScraping();

      console.log("🧹 Running initial cleanup...");
      await this.runCleanup();

      console.log("✅ Initial setup completed successfully!");
    } catch (error) {
      console.error("❌ Initial setup failed:", error.message);
      this.logError("Initial Setup", error);
    }
  }

  async runScraping() {
    if (this.isScraping) {
      console.log("⏳ Scraping already in progress, skipping...");
      return { success: false, message: "Already running" };
    }

    this.isScraping = true;
    const startTime = Date.now();

    try {
      console.log("🎯 Starting automated job scraping...");
      console.log(`⏰ Started at: ${new Date().toLocaleString("en-IN")}`);

      const results = await AutoJobService.scrapeAllJobs();

      // Update stats
      this.stats.lastScrapeTime = new Date();
      this.stats.totalScrapingRuns++;

      // Log comprehensive results
      const duration = Date.now() - startTime;
      console.log("\n" + "=".repeat(50));
      console.log("📊 Scraping Results:");
      console.log(`  ✅ Total Jobs Found: ${results.totalFound}`);
      console.log(`  ➕ New Jobs Added: ${results.totalAdded}`);
      console.log(`  ⏱️  Duration: ${(duration / 1000).toFixed(2)}s`);
      console.log(`  ❌ Errors: ${results.errors.length}`);

      if (Object.keys(results.details).length > 0) {
        console.log("\n📋 Source Breakdown:");
        Object.entries(results.details).forEach(([source, data]) => {
          console.log(
            `  ${source.padEnd(15)}: ${data.found} found, ${data.added} added`
          );
        });
      }

      if (results.errors.length > 0) {
        console.log("\n⚠️  Error Details:");
        results.errors.forEach((err) => {
          console.log(`  • ${err.source}: ${err.error}`);
        });
      }

      console.log("=".repeat(50) + "\n");

      return { success: true, results, duration };
    } catch (error) {
      console.error("❌ Scraping failed:", error.message);
      this.logError("Scraping", error);
      return { success: false, error: error.message };
    } finally {
      this.isScraping = false;
    }
  }

  async runCleanup() {
    if (this.isCleaning) {
      console.log("⏳ Cleanup already in progress, skipping...");
      return { success: false, message: "Already running" };
    }

    this.isCleaning = true;
    const startTime = Date.now();

    try {
      console.log("🧹 Starting expired jobs cleanup...");
      console.log(`⏰ Started at: ${new Date().toLocaleString("en-IN")}`);

      // Soft delete first (mark as expired)
      const expiredCount = await AutoJobService.cleanupExpiredJobs(true);

      // Hard delete very old jobs (>90 days expired)
      const deletedCount = await AutoJobService.cleanupExpiredJobs(false);

      // Update stats
      this.stats.lastCleanupTime = new Date();
      this.stats.totalCleanupRuns++;

      const duration = Date.now() - startTime;
      console.log("\n" + "=".repeat(50));
      console.log("📊 Cleanup Results:");
      console.log(`  ⏸️  Jobs Expired: ${expiredCount}`);
      console.log(`  🗑️  Jobs Deleted: ${deletedCount}`);
      console.log(`  ⏱️  Duration: ${(duration / 1000).toFixed(2)}s`);
      console.log("=".repeat(50) + "\n");

      return {
        success: true,
        expiredCount,
        deletedCount,
        duration,
      };
    } catch (error) {
      console.error("❌ Cleanup failed:", error.message);
      this.logError("Cleanup", error);
      return { success: false, error: error.message };
    } finally {
      this.isCleaning = false;
    }
  }

  async runStatusUpdate() {
    if (this.isUpdating) {
      console.log("⏳ Status update already in progress, skipping...");
      return { success: false, message: "Already running" };
    }

    this.isUpdating = true;
    const startTime = Date.now();

    try {
      console.log("📋 Updating job statuses...");
      console.log(`⏰ Started at: ${new Date().toLocaleString("en-IN")}`);

      const result = await AutoJobService.updateJobStatuses();

      this.stats.lastUpdateTime = new Date();

      const duration = Date.now() - startTime;
      console.log("\n" + "=".repeat(50));
      console.log("📊 Status Update Results:");
      console.log(`  🔒 Jobs Closed: ${result.closedCount}`);
      console.log(`  ⏰ Jobs Expiring Soon: ${result.expiringCount}`);
      console.log(`  ⏱️  Duration: ${(duration / 1000).toFixed(2)}s`);
      console.log("=".repeat(50) + "\n");

      return { success: true, result, duration };
    } catch (error) {
      console.error("❌ Status update failed:", error.message);
      this.logError("Status Update", error);
      return { success: false, error: error.message };
    } finally {
      this.isUpdating = false;
    }
  }

  async runHealthCheck() {
    try {
      console.log("🏥 Running health check...");

      // Check AutoJobService health
      const serviceHealth = await AutoJobService.healthCheck();

      // Check database connection
      const dbHealth = await this.checkDatabaseHealth();

      // Check job statistics
      const jobStats = await this.getJobStatistics();

      const isHealthy = serviceHealth.healthy && dbHealth.healthy;

      console.log(
        `  • Service Status: ${
          serviceHealth.healthy ? "✅ Healthy" : "❌ Unhealthy"
        }`
      );
      console.log(
        `  • Database Status: ${
          dbHealth.healthy ? "✅ Connected" : "❌ Disconnected"
        }`
      );
      console.log(`  • Total Active Jobs: ${jobStats.activeJobs}`);
      console.log(`  • Jobs Added Today: ${jobStats.addedToday}`);

      if (!isHealthy) {
        this.logError("Health Check", new Error("System unhealthy"));
      }

      return {
        healthy: isHealthy,
        service: serviceHealth,
        database: dbHealth,
        stats: jobStats,
      };
    } catch (error) {
      console.error("❌ Health check failed:", error.message);
      this.logError("Health Check", error);
      return { healthy: false, error: error.message };
    }
  }

  async checkDatabaseHealth() {
    try {
      await Job.count();
      return { healthy: true };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  async getJobStatistics() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [activeJobs, addedToday, totalJobs] = await Promise.all([
        Job.count({ where: { status: "active" } }),
        Job.count({
          where: {
            postedDate: { [Op.gte]: today },
            isAutoPosted: true,
          },
        }),
        Job.count(),
      ]);

      return { activeJobs, addedToday, totalJobs };
    } catch (error) {
      return { activeJobs: 0, addedToday: 0, totalJobs: 0 };
    }
  }

  // Manual triggers
  async triggerScraping() {
    console.log("🎯 Manual scraping triggered");
    return await this.runScraping();
  }
  async triggerCleanup() {
    const startTime = Date.now();
    const timestamp = new Date();

    try {
      console.log("🧹 Starting expired job cleanup...");
      console.log(`⏰ Started at: ${timestamp.toLocaleString()}`);

      // FIRST: Mark expired jobs (for reporting)
      const expiredResult = await Job.updateMany(
        {
          applicationDeadline: { $lt: new Date() },
          isAutoPosted: true,
          status: { $in: ["active", "expiring_soon"] },
        },
        { status: "expired" }
      );

      const expiredCount = expiredResult.modifiedCount;

      // THEN: Delete them
      const deleteResult = await Job.deleteMany({
        applicationDeadline: { $lt: new Date() },
        isAutoPosted: true,
      });

      const deletedCount = deleteResult.deletedCount;

      this.stats.totalCleanups++;
      this.stats.lastCleanupResults = {
        timestamp,
        expiredCount,
        deletedCount,
        duration: Date.now() - startTime,
      };

      console.log(`🗑️ Deleted ${deletedCount} expired auto jobs`);

      // Log results
      console.log("\n" + "=".repeat(50));
      console.log("📊 Cleanup Results:");
      console.log(`  ⏸️  Jobs Expired: ${expiredCount}`);
      console.log(`  🗑️  Jobs Deleted: ${deletedCount}`);
      console.log(
        `  ⏱️  Duration: ${((Date.now() - startTime) / 1000).toFixed(2)}s`
      );
      console.log("=".repeat(50) + "\n");

      return {
        success: true,
        message: `Marked ${expiredCount} as expired, deleted ${deletedCount} jobs`,
        expiredCount,
        deletedCount,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      console.error("❌ Cleanup failed:", error.message);
      return {
        success: false,
        message: "Cleanup failed",
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  async triggerStatusUpdate() {
    console.log("📋 Manual status update triggered");
    return await this.runStatusUpdate();
  }

  // Error logging
  logError(taskName, error) {
    const errorLog = {
      task: taskName,
      error: error.message,
      stack: error.stack,
      timestamp: new Date(),
    };

    this.stats.errors.push(errorLog);

    // Keep only last 50 errors
    if (this.stats.errors.length > 50) {
      this.stats.errors = this.stats.errors.slice(-50);
    }
  }

  cleanupErrorLogs() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.stats.errors = this.stats.errors.filter(
      (err) => err.timestamp > oneWeekAgo
    );
    console.log(
      `✅ Cleaned up old error logs. Current errors: ${this.stats.errors.length}`
    );
  }

  // Get comprehensive status
  getStatus() {
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);

    return {
      active: {
        isScraping: this.isScraping,
        isCleaning: this.isCleaning,
        isUpdating: this.isUpdating,
      },
      schedules: {
        scraping: "Daily at 12:00 AM IST",
        cleanup: "Daily at 12:05 AM IST",
        statusUpdate: "Daily at 12:10 AM IST",
        healthCheck: "Every 6 hours",
      },
      nextRun: {
        scraping: nextMidnight.toLocaleString("en-IN"),
        cleanup: new Date(nextMidnight.getTime() + 5 * 60000).toLocaleString(
          "en-IN"
        ),
        statusUpdate: new Date(
          nextMidnight.getTime() + 10 * 60000
        ).toLocaleString("en-IN"),
      },
      statistics: this.stats,
      uptime: process.uptime(),
      tasksCount: this.tasks.length,
    };
  }

  // Get detailed statistics
  getStatistics() {
    return {
      ...this.stats,
      recentErrors: this.stats.errors.slice(-10),
    };
  }

  // Stop all scheduled tasks
  stop() {
    console.log("🛑 Stopping all scheduled tasks...");
    this.tasks.forEach(({ name, task }) => {
      task.stop();
      console.log(`  ✅ Stopped: ${name}`);
    });
    console.log("✅ All tasks stopped");
  }

  // Restart all tasks
  restart() {
    console.log("🔄 Restarting scheduler...");
    this.stop();
    this.tasks = [];
    this.start();
  }
}

export default new JobScheduler();
