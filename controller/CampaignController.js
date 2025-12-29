import Campaign from "../models/campaign.js";
import User from "../models/user.js";
import CampaignSupport from "../models/campaignSupport.js";
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
      upiId,
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
      !contact ||
      !upiId
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

    // Check if user exists (Unified User Model)
    let user;
    let campaignEmail = email;
    let campaignUserType = userType;
    let isApproved = false;

    if (["admin", "hod", "faculty"].includes(userType)) {
      // Internal educational users - use a generic authority email or their own?
      // Keeping original behavior where admin campaigns use a fixed vice chancellor email
      if (userType === "admin") {
        campaignEmail = "vicechancellor@mitsgwalior.in";
      }
      isApproved = true; // Internal campaigns are auto-approved
      user = { _id: "college_staff" }; // Placeholder for existence check
    } else if (["alumni", "student"].includes(userType)) {
      user = await User.findOne({ email, userType });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      isApproved = false; // Students/Alumni need approval
    } else {
      return res.status(400).json({ message: "Invalid user type" });
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
      upiId,
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

    // Check if user owns the campaign or is admin
    const isAdmin = userType === "admin";
    if (!isAdmin && campaign.email !== email) {
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
    const { email, userType } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid campaign ID format",
      });
    }

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
      contact,
      isApproved,
      isCompleted,
      upiId,
    } = req.body;

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    const isAdmin = userType === "admin";
    if (!isAdmin && campaign.email !== email) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own campaigns",
      });
    }

    // Handle image uploads if new ones are provided
    let imageUrls = campaign.images || [];
    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        try {
          const url = await uploadToCloudinary(file);
          newImages.push(url);
        } catch (uploadError) {
          console.error("❌ Cloudinary upload error:", uploadError);
          return res.status(500).json({
            success: false,
            message: "Error uploading images to Cloudinary",
          });
        }
      }
      imageUrls = newImages;
    }

    // Prepare update data
    const updateData = {
      campaignTitle,
      categories,
      tagline,
      detailedDescription,
      startDate: startDate ? new Date(startDate) : campaign.startDate,
      endDate: endDate ? new Date(endDate) : campaign.endDate,
      totalAmount: totalAmount ? parseFloat(totalAmount) : campaign.totalAmount,
      currentAmount: currentAmount ? parseFloat(currentAmount) : campaign.currentAmount,
      projectLink,
      github,
      images: imageUrls,
      contact,
      upiId,
    };

    if (userType === "admin") {
      if (isApproved !== undefined) updateData.isApproved = isApproved === 'true' || isApproved === true;
      if (isCompleted !== undefined) updateData.isCompleted = isCompleted === 'true' || isCompleted === true;
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      data: {
        ...updatedCampaign.toJSON(),
        id: updatedCampaign._id,
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

// Support Campaign logic
export const supportCampaign = async (req, res) => {
  try {
    const { campaignId, amount, transactionId, supporterName } = req.body;
    const { email, userType } = req.user;

    if (!campaignId || !amount || !transactionId || !supporterName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const support = await CampaignSupport.create({
      campaignId,
      supporterEmail: email,
      supporterName,
      supporterUserType: userType,
      amount: parseFloat(amount),
      transactionId,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Support request submitted successfully. Pending verification.",
      data: support,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Transaction ID already used" });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get Supports for a specific campaign (Holder/Admin view)
export const getCampaignSupports = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { email, userType } = req.user;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Only owner or admin can see all supports
    if (campaign.email !== email && userType !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const supports = await CampaignSupport.find({ campaignId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: supports,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Verify/Reject Support
export const updateSupportStatus = async (req, res) => {
  try {
    const { supportId } = req.params;
    const { status } = req.body; // 'verified' or 'rejected'

    // Ensure req.user exists (middleware should handle this, but for safety)
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const { email, userType } = req.user;

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const support = await CampaignSupport.findById(supportId);
    if (!support) {
      return res.status(404).json({ message: "Support record not found" });
    }

    const campaign = await Campaign.findById(support.campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Only owner or admin can verify
    if (campaign.email !== email && userType !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (support.status === "verified") {
      return res.status(400).json({ message: "Already verified" });
    }

    // Update status
    support.status = status;

    if (status === "verified") {
      support.verifiedAt = new Date();
      support.complaintText = null; // Remove complaint if verified

      // Save support first to guard against double-counting
      await support.save();

      if (status === "verified") {
        try {
          const addAmount = Number(support.amount);
          if (!isNaN(addAmount)) {
            campaign.currentAmount = (Number(campaign.currentAmount) || 0) + addAmount;

            // Auto complete if target reached
            if (campaign.currentAmount >= campaign.totalAmount) {
              campaign.isCompleted = true;
            }

            await campaign.save();
          } else {
            console.error("Invalid support amount:", support.amount);
          }
        } catch (campaignError) {
          console.error("Error updating campaign amount:", campaignError);
          // Note: support is verified, but campaign amount update failed
        }
      }
    } else {
      await support.save();
    }

    res.status(200).json({
      success: true,
      message: `Support ${status} successfully`,
      data: support,
      updatedCurrentAmount: campaign.currentAmount
    });
  } catch (error) {
    console.error("Error in updateSupportStatus:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// File Complaint
export const fileComplaint = async (req, res) => {
  try {
    const { supportId } = req.params;
    const { complaintText } = req.body;
    const { email } = req.user;

    const support = await CampaignSupport.findById(supportId);
    if (!support) {
      return res.status(404).json({ message: "Support record not found" });
    }

    if (support.supporterEmail !== email) {
      return res.status(403).json({ message: "You can only file complaints for your own donations" });
    }

    if (support.status === "verified") {
      return res.status(400).json({ message: "Cannot raise a query for an already accepted payment" });
    }

    support.status = "disputed";
    support.complaintText = complaintText;
    await support.save();

    res.status(200).json({
      success: true,
      message: "Complaint filed successfully",
      data: support,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get Verified Supporters (Public View)
export const getVerifiedSupporters = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const supporters = await CampaignSupport.find({
      campaignId,
      status: "verified"
    }).select("supporterName supporterEmail supporterUserType amount verifiedAt").sort({ verifiedAt: -1 });

    res.status(200).json({
      success: true,
      data: supporters,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get Complaints for a Campaign (Public/Restricted View)
export const getCampaignComplaints = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const complaints = await CampaignSupport.find({
      campaignId,
      status: "disputed"
    }).select("supporterName supporterEmail supporterUserType complaintText createdAt amount transactionId");

    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get current user's support for a specific campaign
export const getMySupportForCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { email } = req.user;

    const supports = await CampaignSupport.find({
      campaignId,
      supporterEmail: email
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: supports,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
