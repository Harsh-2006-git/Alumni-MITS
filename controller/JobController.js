// controllers/jobController.js
import Job from "../models/Job.js";

// Create a new job
export const createJob = async (req, res) => {
  try {
    // Get user data from token
    const { email, userType } = req.user;

    // All available fields from req.body
    const {
      title,
      company,
      companyLogo,
      type,
      location,
      salary,
      experience,
      applicationDeadline,
      closedDate,
      verified,
      description,
      requiredSkills,
      qualifications,
      companyWebsite,
      category,
      status,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !company ||
      !location ||
      !applicationDeadline ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, company, location, application deadline, and description are required fields",
      });
    }

    // Create job with all fields including user data from token
    const job = await Job.create({
      title,
      company,
      companyLogo,
      type,
      location,
      salary,
      experience,
      applicationDeadline,
      closedDate,
      verified,
      description,
      requiredSkills,
      qualifications,
      companyWebsite,
      category,
      status,
      email, // From token
      userType, // From token
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      success: false,
      message: "Error creating job",
      error: error.message,
    });
  }
};

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      error: error.message,
    });
  }
};

// Update job by ID
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user; // Get email from token for authorization

    // All available fields from req.body
    const {
      title,
      company,
      companyLogo,
      type,
      location,
      salary,
      experience,
      applicationDeadline,
      closedDate,
      verified,
      description,
      requiredSkills,
      qualifications,
      companyWebsite,
      category,
      status,
    } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user owns the job
    if (job.email !== email) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own jobs",
      });
    }

    // Update job with all fields (except email and userType which remain from original)
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        title,
        company,
        companyLogo,
        type,
        location,
        salary,
        experience,
        applicationDeadline,
        closedDate,
        verified,
        description,
        requiredSkills,
        qualifications,
        companyWebsite,
        category,
        status,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({
      success: false,
      message: "Error updating job",
      error: error.message,
    });
  }
};

// Delete job by ID
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, userType } = req.user; // Get email from token for authorization

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user owns the job
    const canDelete = userType === "admin" || job.email === email;

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own jobs",
      });
    }
    await Job.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting job",
      error: error.message,
    });
  }
};

// Get jobs by current user (from token)
export const getMyJobs = async (req, res) => {
  try {
    const { email, userType } = req.user;

    const jobs = await Job.find({
      email,
      userType,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      error: error.message,
    });
  }
};
