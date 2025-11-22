// routes/campaignRoutes.js
import express from "express";
import {
  createCampaign,
  getAllCampaigns,
  getAllCampaignsAdmin,
  updateCampaignApproval,
  deleteCampaign,
  updateCampaign,
  getmyCampaigns,
} from "../controller/CampaignController.js";
import { upload } from "../controller/AlumniController.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create campaign route with file upload (max 3 images)
router.post(
  "/create-campaign",
  authenticateToken,
  upload.array("images", 3),
  createCampaign
);

// Public routes (only approved campaigns)
router.get("/get-approve-campaign", getAllCampaigns);
router.get("/get-my-campaigns", authenticateToken, getmyCampaigns);

// Admin routes (all campaigns including unapproved)
router.get("/all-campaign", getAllCampaignsAdmin);
router.patch("/:id/approval", authenticateToken, updateCampaignApproval);
router.delete("/delete/:id", authenticateToken, deleteCampaign);
router.put("/update/:id", authenticateToken, updateCampaign);

export default router;
