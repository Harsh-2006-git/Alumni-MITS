// controllers/campaignController.js
import Campaign from "../models/campaign.js";
import Alumni from "../models/alumni.js";
import Student from "../models/user.js";
import cloudinary from "cloudinary";
import multer from "multer";
import mongoose from "mongoose";

// Create Campaign Controller
export const createCampaign = async (req, res) => {
  try {
    const {
      campaignTitle,
      categories,
      tagline,
      detailedDescription,
      startDate,
      endDate,
      totalAmount,
      projectLink,
      github,
      contact,
    } = req.body;

    // Get user info from token (assuming it's attached to req.user)
    const { email, userType } = req.user;

    // Validate required fields
    if (
      !campaignTitle ||
      !categories ||
      !startDate ||
      !endDate ||
      !totalAmount ||
      !contact
    ) {
      return res.status(400).json({
        message:
          "Campaign title, categories, start date, end date, total amount, and contact are required fields",
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({
        message: "Start date cannot be in the past",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    // Check if user exists and handle college user type
    let user;
    let campaignEmail = email;
    let campaignUserType = userType;
    let isApproved = false; // Default to false

    if (userType === "alumni") {
      user = await Alumni.findOne({ email });
      isApproved = false; // Alumni campaigns need approval
    } else if (userType === "student") {
      user = await Student.findOne({ email });
      isApproved = false; // Student campaigns need approval
    } else if (userType === "admin") {
      // For college user type, use vice chancellor email and auto-approve
      campaignEmail = "vicechancellor@mitsgwalior.in";
      campaignUserType = "admin";
      isApproved = true; // College campaigns are auto-approved
      // No need to check user existence in Alumni/Student tables for college
      user = { _id: "college_admin" }; // Mock user object for college
    } else {
      return res.status(400).json({
        message: "Invalid user type",
      });
    }

    // For student and alumni, verify user exists
    if (userType !== "admin" && !user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Handle image uploads
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      // Check maximum 3 images
      if (req.files.length > 3) {
        return res.status(400).json({
          message: "Maximum 3 images allowed",
        });
      }

      // Upload each image to Cloudinary
      for (const file of req.files) {
        try {
          const imageUrl = await uploadToCloudinary(file);
          imageUrls.push(imageUrl);
        } catch (uploadError) {
          console.error("❌ Cloudinary upload error:", uploadError);
          return res.status(500).json({
            message: "Error uploading images to Cloudinary",
          });
        }
      }
    }

    // Create campaign in database - store images as array directly
    const campaign = await Campaign.create({
      campaignTitle,
      categories,
      tagline: tagline || null,
      detailedDescription: detailedDescription || null,
      startDate: start,
      endDate: end,
      totalAmount: parseFloat(totalAmount),
      projectLink: projectLink || null,
      github: github || null,
      images: imageUrls, // Store as array directly, no need for comma separation
      email: campaignEmail, // Use vice chancellor email for college type
      contact,
      userType: campaignUserType,
      isApproved, // Set based on userType
    });

    console.log("✅ Campaign created successfully");

    res.status(201).json({
      message: "Campaign created successfully",
      campaign: {
        id: campaign._id, // This is now a string ObjectId
        campaignTitle: campaign.campaignTitle,
        categories: campaign.categories,
        tagline: campaign.tagline,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        totalAmount: campaign.totalAmount,
        projectLink: campaign.projectLink,
        github: campaign.github,
        images: campaign.images || [], // Already an array
        email: campaign.email,
        contact: campaign.contact,
        userType: campaign.userType,
        isApproved: campaign.isApproved,
      },
    });
  } catch (error) {
    console.error("❌ Create Campaign Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Cloudinary Upload Function
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
      return reject(new Error("Only JPEG, JPG and PNG images are allowed"));
    }

    // Generate unique public_id for campaign images
    const publicId = `campaigns/${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    const stream = cloudinary.v2.uploader.upload_stream(
      {
        public_id: publicId,
        folder: "campaigns",
        resource_type: "image",
      },
      (error, uploadResult) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          reject(new Error("Error uploading to Cloudinary"));
        } else {
          console.log(
            "✅ Image uploaded to Cloudinary:",
            uploadResult.secure_url
          );
          resolve(uploadResult.secure_url);
        }
      }
    );

    stream.end(file.buffer);
  });
};

// Get all campaigns (only approved ones for public view)
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isApproved: true }) // Only show approved campaigns
      .sort({ createdAt: -1 });

    // No need to convert images - they're already arrays
    const campaignsWithImageArray = campaigns.map((campaign) => ({
      ...campaign.toJSON(),
      id: campaign._id, // Include string _id as id
      images: campaign.images || [], // Already an array
    }));

    res.status(200).json({
      message: "Campaigns fetched successfully",
      campaigns: campaignsWithImageArray,
    });
  } catch (error) {
    console.error("❌ Get Campaigns Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getmyCampaigns = async (req, res) => {
  try {
    const { email, userType } = req.user;
    const campaigns = await Campaign.find({ email: email, userType: userType }) // Only show approved campaigns
      .sort({ createdAt: -1 });

    // No need to convert images - they're already arrays
    const campaignsWithImageArray = campaigns.map((campaign) => ({
      ...campaign.toJSON(),
      id: campaign._id, // Include string _id as id
      images: campaign.images || [], // Already an array
    }));

    res.status(200).json({
      message: "Campaigns fetched successfully",
      campaigns: campaignsWithImageArray,
    });
  } catch (error) {
    console.error("❌ Get Campaigns Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all campaigns for admin (unapproved)
export const getAllCampaignsAdmin = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });

    // No need to convert images - they're already arrays
    const campaignsWithImageArray = campaigns.map((campaign) => ({
      ...campaign.toJSON(),
      id: campaign._id, // Include string _id as id
      images: campaign.images || [], // Already an array
    }));

    res.status(200).json({
      message: "All campaigns fetched successfully",
      campaigns: campaignsWithImageArray,
    });
  } catch (error) {
    console.error("❌ Get All Campaigns Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Approve/Reject campaign (Admin function)
export const updateCampaignApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    const userType = req.user?.userType;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid campaign ID format",
      });
    }

    // Check if user is admin or has sufficient privileges
    const allowedUserTypes = ["admin", "superadmin", "moderator"];
    if (!allowedUserTypes.includes(userType)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions to manage campaigns",
      });
    }

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    if (isApproved) {
      // Approve campaign
      campaign.isApproved = true;
      await campaign.save();
      console.log(`📝 Campaign ${campaign._id} approved by ${userType}`);

      return res.status(200).json({
        message: "Campaign approved successfully",
        campaign: {
          id: campaign._id, // String ID
          campaignTitle: campaign.campaignTitle,
          isApproved: campaign.isApproved,
          userType: campaign.userType,
          email: campaign.email,
          categories: campaign.categories,
        },
      });
    } else {
      // Reject campaign and delete it
      await Campaign.findByIdAndDelete(id);
      console.log(
        `🗑️ Campaign ${campaign._id} rejected and deleted by ${userType}`
      );

      return res.status(200).json({
        message: "Campaign rejected and deleted successfully",
        campaignId: campaign._id, // String ID
      });
    }
  } catch (error) {
    console.error("❌ Update Campaign Approval Error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, userType } = req.user; // Get email from token for authorization

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid campaign ID format",
      });
    }

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Check if user owns the campaign
    if (campaign.email !== email && campaign.userType !== userType) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own campaign",
      });
    }

    await Campaign.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting campaign",
      error: error.message,
    });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, userType } = req.user; // Get user data from token

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid campaign ID format",
      });
    }

    // All available fields from req.body
    const {
      campaignTitle,
      categories,
      tagline,
      detailedDescription,
      startDate,
      endDate,
      totalAmount,
      currentAmount,
      projectLink,
      github,
      images,
      contact,
      isApproved,
      isCompleted,
    } = req.body;

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Check if user owns the campaign or is admin
    if (campaign.email !== email && campaign.userType !== userType) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own campaigns",
      });
    }

    // Prepare update data
    const updateData = {
      campaignTitle,
      categories,
      tagline,
      detailedDescription,
      startDate,
      endDate,
      totalAmount,
      currentAmount,
      projectLink,
      github,
      images,
      contact,
    };

    // Only allow admin to update approval and completion status
    if (userType === "admin") {
      if (isApproved !== undefined) updateData.isApproved = isApproved;
      if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
    }

    // Update campaign
    const updatedCampaign = await Campaign.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      data: {
        ...updatedCampaign.toJSON(),
        id: updatedCampaign._id, // Include string _id as id
      },
    });
  } catch (error) {
    console.error("Error updating campaign:", error);
    res.status(500).json({
      success: false,
      message: "Error updating campaign",
      error: error.message,
    });
  }
};

// Get single campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid campaign ID format",
      });
    }

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaign fetched successfully",
      data: {
        ...campaign.toJSON(),
        id: campaign._id, // Include string _id as id
      },
    });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching campaign",
      error: error.message,
    });
  }
};
