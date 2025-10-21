// routes/jobRoutes.js
import express from "express";
import {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  getMyJobs,
} from "../controller/jobController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes (require authentication)
router.post("/create-job", authenticateToken, createJob);
router.get("/my-jobs", authenticateToken, getMyJobs);
router.put("/update/:id", authenticateToken, updateJob);
router.delete("/delete/:id", authenticateToken, deleteJob);

// Public routes
router.get("/all-jobs", getAllJobs);

export default router;
