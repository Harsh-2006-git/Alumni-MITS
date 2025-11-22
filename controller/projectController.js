// controllers/projectController.js
import Project from "../models/project.js";

// Create a new project
export const createProject = async (req, res) => {
  try {
    // Get user data from token
    const { email, userType } = req.user;

    // All available fields from req.body
    const {
      title,
      shortDesc,
      detailedDesc,
      techStack,
      category,
      lookingForContributors,
      contributorsNeeded,
      roles,
      repoLink,
      contactLink,
      visibility,
      tags,
      thumbnail,
      guidelines,
    } = req.body;

    // Log all received fields
    console.log("Received project data:", {
      title,
      shortDesc,
      detailedDesc,
      techStack,
      category,
      lookingForContributors,
      contributorsNeeded,
      roles,
      repoLink,
      contactLink,
      visibility,
      tags,
      thumbnail,
      guidelines,
      email, // From token
      userType, // From token
    });

    // Validate required fields
    if (!title || !shortDesc) {
      return res.status(400).json({
        success: false,
        message: "Title and short description are required fields",
      });
    }

    // Create project with all fields including user data from token
    const project = await Project.create({
      title,
      shortDesc,
      detailedDesc,
      techStack,
      category,
      lookingForContributors,
      contributorsNeeded,
      roles,
      repoLink,
      contactLink,
      visibility,
      tags,
      thumbnail,
      guidelines,
      email, // From token
      userType, // From token
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Error creating project",
      error: error.message,
    });
  }
};

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

// Get single project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: error.message,
    });
  }
};

// Update project by ID
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user; // Get email from token for authorization

    // All available fields from req.body
    const {
      title,
      shortDesc,
      detailedDesc,
      techStack,
      category,
      lookingForContributors,
      contributorsNeeded,
      roles,
      repoLink,
      contactLink,
      visibility,
      tags,
      thumbnail,
      guidelines,
    } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user owns the project
    if (project.email !== email) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own projects",
      });
    }

    // Update project with all fields (except email and userType which remain from original)
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        shortDesc,
        detailedDesc,
        techStack,
        category,
        lookingForContributors,
        contributorsNeeded,
        roles,
        repoLink,
        contactLink,
        visibility,
        tags,
        thumbnail,
        guidelines,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Error updating project",
      error: error.message,
    });
  }
};

// Delete project by ID
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user; // Get email from token for authorization

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user owns the project
    if (project.email !== email) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own projects",
      });
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: error.message,
    });
  }
};

// Get projects by current user (from token)
export const getMyProjects = async (req, res) => {
  try {
    const { email, userType } = req.user;

    const projects = await Project.find({
      email,
      userType,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

// Get projects looking for contributors
export const getProjectsNeedingContributors = async (req, res) => {
  try {
    const projects = await Project.find({
      lookingForContributors: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects needing contributors:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
};
