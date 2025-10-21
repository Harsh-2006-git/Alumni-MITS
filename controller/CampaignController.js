// controllers/campaignController.js
import Campaign from "../models/campaign.js";
import Alumni from "../models/alumni.js";
import Student from "../models/user.js";
import cloudinary from "cloudinary";
import multer from "multer";

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
      user = await Alumni.findOne({ where: { email } });
      isApproved = false; // Alumni campaigns need approval
    } else if (userType === "student") {
      user = await Student.findOne({ where: { email } });
      isApproved = false; // Student campaigns need approval
    } else if (userType === "admin") {
      // For college user type, use vice chancellor email and auto-approve
      campaignEmail = "vicechancellor@mitsgwalior.in";
      campaignUserType = "admin";
      isApproved = true; // College campaigns are auto-approved
      // No need to check user existence in Alumni/Student tables for college
      user = { id: "college_admin" }; // Mock user object for college
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

    // Create campaign in database
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
      images: imageUrls.length > 0 ? imageUrls.join(",") : null, // Comma separated
      email: campaignEmail, // Use vice chancellor email for college type
      contact,
      userType: campaignUserType,
      isApproved, // Set based on userType
    });

    console.log("✅ Campaign created successfully");

    res.status(201).json({
      message: "Campaign created successfully",
      campaign: {
        id: campaign.id,
        campaignTitle: campaign.campaignTitle,
        categories: campaign.categories,
        tagline: campaign.tagline,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        totalAmount: campaign.totalAmount,
        projectLink: campaign.projectLink,
        github: campaign.github,
        images: campaign.images ? campaign.images.split(",") : [],
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
    const campaigns = await Campaign.findAll({
      where: { isApproved: true }, // Only show approved campaigns
      order: [["createdAt", "DESC"]],
    });

    // Convert comma separated images back to array
    const campaignsWithImageArray = campaigns.map((campaign) => ({
      ...campaign.toJSON(),
      images: campaign.images ? campaign.images.split(",") : [],
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
    const campaigns = await Campaign.findAll({
      where: { email: email, userType: userType }, // Only show approved campaigns
      order: [["createdAt", "DESC"]],
    });

    // Convert comma separated images back to array
    const campaignsWithImageArray = campaigns.map((campaign) => ({
      ...campaign.toJSON(),
      images: campaign.images ? campaign.images.split(",") : [],
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
    const campaigns = await Campaign.findAll({
      order: [["createdAt", "DESC"]],
    });

    // Convert comma separated images back to array
    const campaignsWithImageArray = campaigns.map((campaign) => ({
      ...campaign.toJSON(),
      images: campaign.images ? campaign.images.split(",") : [],
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

    // Check if user is admin or has sufficient privileges
    const allowedUserTypes = ["admin", "superadmin", "moderator"];
    if (!allowedUserTypes.includes(userType)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions to manage campaigns",
      });
    }

    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    if (isApproved) {
      // Approve campaign
      campaign.isApproved = true;
      await campaign.save();
      console.log(`📝 Campaign ${campaign.id} approved by ${userType}`);

      return res.status(200).json({
        message: "Campaign approved successfully",
        campaign: {
          id: campaign.id,
          campaignTitle: campaign.campaignTitle,
          isApproved: campaign.isApproved,
          userType: campaign.userType,
          email: campaign.email,
          categories: campaign.categories,
        },
      });
    } else {
      // Reject campaign and delete it
      await campaign.destroy();
      console.log(
        `🗑️ Campaign ${campaign.id} rejected and deleted by ${userType}`
      );

      return res.status(200).json({
        message: "Campaign rejected and deleted successfully",
        campaignId: campaign.id,
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

    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "campaign not found",
      });
    }

    // Check if user owns the job
    if (campaign.email !== email && campaign.userType !== userType) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own campaign",
      });
    }

    await campaign.destroy();

    res.status(200).json({
      success: true,
      message: "campaign deleted successfully",
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

    const campaign = await Campaign.findByPk(id);

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
    await campaign.update(updateData);

    res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      data: campaign,
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
