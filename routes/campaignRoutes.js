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
  supportCampaign,
  getCampaignSupports,
  updateSupportStatus,
  fileComplaint,
  getVerifiedSupporters,
  getCampaignComplaints,
  getMySupportForCampaign,
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

// Support & Verification Routes
router.post("/support", authenticateToken, supportCampaign);
router.get("/:campaignId/supports", authenticateToken, getCampaignSupports);
router.patch("/support/:supportId/status", authenticateToken, updateSupportStatus);
router.post("/support/:supportId/complaint", authenticateToken, fileComplaint);

// Public Supporter/Complaint Views
router.get("/:campaignId/verified-supporters", getVerifiedSupporters);
router.get("/:campaignId/complaints", getCampaignComplaints);
router.get("/:campaignId/my-support", authenticateToken, getMySupportForCampaign);

// Admin routes (all campaigns including unapproved)
router.get("/all-campaign", getAllCampaignsAdmin);
router.patch("/:id/approval", authenticateToken, updateCampaignApproval);
router.delete("/delete/:id", authenticateToken, deleteCampaign);
router.put("/update/:id", authenticateToken, upload.array("images", 3), updateCampaign);

export default router;
