// routes/jobRoutes.js
import express from "express";
import Job from "../models/Job.js";
import {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  getMyJobs,
} from "../controller/JobController.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import { Op } from "sequelize";

const router = express.Router();

// Protected routes (require authentication)
router.post("/create-job", authenticateToken, createJob);
router.get("/my-jobs", authenticateToken, getMyJobs);
router.put("/update/:id", authenticateToken, updateJob);
router.delete("/delete/:id", authenticateToken, deleteJob);

// Public routes
router.get("/all-jobs", getAllJobs);

// GET /api/jobs - Get all jobs with filtering, sorting, and pagination
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      category,
      location,
      search,
      status = "active",
      sortBy = "postedDate",
      sortOrder = "DESC",
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    // Status filter
    if (status !== "all") {
      where.status = status;
    }

    // Type filter
    if (type && type !== "all") {
      where.type = type;
    }

    // Category filter
    if (category && category !== "all") {
      where.category = category;
    }

    // Location filter
    if (location && location !== "all") {
      where.location = {
        [Op.iLike]: `%${location}%`,
      };
    }

    // Search filter
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Only show non-expired jobs for active status
    if (status === "active") {
      where.applicationDeadline = {
        [Op.gte]: new Date(),
      };
    }

    // Get jobs with pagination
    const jobs = await Job.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      attributes: {
        exclude: ["createdAt", "updatedAt"], // Exclude timestamps if not needed
      },
    });

    // Response data
    const response = {
      success: true,
      data: jobs.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(jobs.count / limit),
        totalJobs: jobs.count,
        hasNext: page * limit < jobs.count,
        hasPrev: page > 1,
      },
      filters: {
        availableTypes: await getDistinctValues("type"),
        availableCategories: await getDistinctValues("category"),
        availableLocations: await getDistinctValues("location"),
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
});

// GET /api/jobs/:id - Get single job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Increment view count
    // Note: You might want to add a 'views' field to your model

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
});

// GET /api/jobs/stats - Get job statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const totalJobs = await Job.count();
    const activeJobs = await Job.count({
      where: {
        status: "active",
        applicationDeadline: {
          [Op.gte]: new Date(),
        },
      },
    });
    const internshipJobs = await Job.count({
      where: {
        type: "internship",
        status: "active",
      },
    });
    const remoteJobs = await Job.count({
      where: {
        type: "remote",
        status: "active",
      },
    });
    const autoPostedJobs = await Job.count({
      where: {
        isAutoPosted: true,
        status: "active",
      },
    });

    res.json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        internshipJobs,
        remoteJobs,
        autoPostedJobs,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
});

// GET /api/jobs/categories/list - Get all available categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await getDistinctValues("category");

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
});

// Helper function to get distinct values
async function getDistinctValues(column) {
  const results = await Job.findAll({
    attributes: [
      [Job.sequelize.fn("DISTINCT", Job.sequelize.col(column)), column],
    ],
    where: {
      status: "active",
      applicationDeadline: {
        [Op.gte]: new Date(),
      },
    },
    raw: true,
  });

  return results.map((item) => item[column]).filter(Boolean);
}

export default router;
