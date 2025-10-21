// routes/projectRoutes.js
import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
  getProjectsNeedingContributors,
} from "../controller/projectController.js";
import authenticateToken from "../middlewares/authMiddleware.js"; // Your auth middleware

const router = express.Router();

// Protected routes (require authentication)
router.post("/create-projects", authenticateToken, createProject);
router.get("/my-projects", authenticateToken, getMyProjects);
router.put("/update/:id", authenticateToken, updateProject);
router.delete("/delete/:id", authenticateToken, deleteProject);

// Public routes
router.get("/all-projects", getAllProjects);
router.get("/needing-contributors", getProjectsNeedingContributors);
router.get("/:id", getProjectById);

export default router;
