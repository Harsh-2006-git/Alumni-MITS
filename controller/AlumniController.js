import AlumniProfile from "../models/AlumniProfile.js";
import Alumni from "../models/alumni.js";
import Student from "../models/user.js";
import StudentProfile from "../models/studentProfile.js";
import { sequelize } from "../config/database.js";

export const saveAlumniProfile = async (req, res) => {
  try {
    const alumniId = req.user.id; // Extracted from JWT by middleware
    if (!alumniId) {
      return res.status(400).json({ message: "Alumni ID not found in token" });
    }

    const {
      location,
      branch,
      about,
      skills,
      achievements,
      linkedin,
      github,
      twitter,
      portfolio,
      education,
      experience,
    } = req.body;

    // Check if profile exists
    let profile = await AlumniProfile.findOne({ where: { alumniId } });

    if (profile) {
      // Update existing profile
      await profile.update({
        location,
        branch,
        about,
        skills,
        achievements,
        linkedin,
        github,
        twitter,
        portfolio,
        education,
        experience,
      });
    } else {
      // Create new profile
      profile = await AlumniProfile.create({
        alumniId,
        location,
        branch,
        about,
        skills,
        achievements,
        linkedin,
        github,
        twitter,
        portfolio,
        education,
        experience,
      });
    }

    res.status(200).json({ message: "Profile saved successfully", profile });
  } catch (error) {
    console.error("Error saving alumni profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const saveStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id; // Extracted from JWT by middleware

    if (!studentId) {
      return res.status(400).json({ message: "Student ID not found in token" });
    }

    const {
      location,
      branch,
      about,
      skills,
      achievements,
      linkedin,
      github,
      twitter,
      portfolio,
      education,
      experience,
    } = req.body;

    // Check if profile exists
    let profile = await StudentProfile.findOne({ where: { studentId } });

    if (profile) {
      // Update existing profile
      await profile.update({
        location,
        branch,
        about,
        skills,
        achievements,
        linkedin,
        github,
        twitter,
        portfolio,
        education,
        experience,
      });
    } else {
      // Create new profile
      profile = await StudentProfile.create({
        studentId,
        location,
        branch,
        about,
        skills,
        achievements,
        linkedin,
        github,
        twitter,
        portfolio,
        education,
        experience,
      });
    }

    res.status(200).json({
      message: "Student profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Error saving student profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteAlumni = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Alumni ID is required",
      });
    }

    // Check if alumni exists
    const alumni = await Alumni.findByPk(id);
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    // Use transaction to ensure data consistency
    const transaction = await sequelize.transaction();

    try {
      // Delete alumni profile first (due to foreign key constraint)
      await AlumniProfile.destroy({
        where: { alumniId: id },
        transaction,
      });

      // Delete alumni record
      await Alumni.destroy({
        where: { id },
        transaction,
      });

      // Commit transaction
      await transaction.commit();

      res.status(200).json({
        success: true,
        message: "Alumni deleted successfully",
        data: {
          id: id,
          name: alumni.name,
          email: alumni.email,
        },
      });
    } catch (transactionError) {
      // Rollback transaction if any error occurs
      await transaction.rollback();
      throw transactionError;
    }
  } catch (error) {
    console.error("Delete alumni error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting alumni",
      error: error.message,
    });
  }
};
export const getAlumniProfile = async (req, res) => {
  try {
    // Extract user info from token (middleware must set req.user)
    const { id, userType } = req.user;

    if (!id || userType !== "alumni") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Fetch alumni along with related profile data
    const alumni = await Alumni.findOne({
      where: { id },
      include: [
        {
          model: AlumniProfile,
          as: "profile",
        },
      ],
    });

    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    res.status(200).json({
      message: "Alumni details fetched successfully",
      alumni,
    });
  } catch (error) {
    console.error("Error fetching alumni details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const { id, userType } = req.user;

    // Ensure only students can access this route
    if (!id || userType !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Fetch student and their associated profile
    const student = await Student.findOne({
      where: { id },
      include: [
        {
          model: StudentProfile,
          as: "profile",
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student details fetched successfully",
      student,
    });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllAlumni = async (req, res) => {
  try {
    const alumniList = await Alumni.findAll({
      where: { isVerified: true },
      include: [
        {
          model: AlumniProfile,
          as: "profile",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      order: [["id", "ASC"]],
    });

    // ✅ Combine both resumes for clarity
    const formattedAlumni = alumniList.map((alumni) => ({
      id: alumni.id,
      name: alumni.name,
      email: alumni.email,
      phone: alumni.phone,
      isVerified: alumni.isVerified,
      userType: alumni.userType,
      profilePhoto: alumni.profilePhoto || null,
      alumniResume: alumni.resume || null, // from main Alumni table
      profileResume: alumni.profile?.resume || null, // from AlumniProfile
      profile: alumni.profile || {},
    }));

    res.status(200).json({
      success: true,
      count: formattedAlumni.length,
      data: formattedAlumni,
    });
  } catch (error) {
    console.error("Error fetching all alumni:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching alumni.",
      error: error.message,
    });
  }
};
export const getAllAlumni2 = async (req, res) => {
  try {
    const alumniList = await Alumni.findAll({
      include: [
        {
          model: AlumniProfile,
          as: "profile",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      order: [["id", "ASC"]],
    });

    // ✅ Combine both resumes for clarity
    const formattedAlumni = alumniList.map((alumni) => ({
      id: alumni.id,
      name: alumni.name,
      email: alumni.email,
      phone: alumni.phone,
      isVerified: alumni.isVerified,
      userType: alumni.userType,
      profilePhoto: alumni.profilePhoto || null,
      alumniResume: alumni.resume || null, // from main Alumni table
      profileResume: alumni.profile?.resume || null, // from AlumniProfile
      profile: alumni.profile || {},
    }));

    res.status(200).json({
      success: true,
      count: formattedAlumni.length,
      data: formattedAlumni,
    });
  } catch (error) {
    console.error("Error fetching all alumni:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching alumni.",
      error: error.message,
    });
  }
};
export const getUnverifiedAlumni = async (req, res) => {
  try {
    const pendingAlumni = await Alumni.findAll({
      where: { isVerified: false },
      include: [
        {
          model: AlumniProfile,
          as: "profile",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      order: [["id", "ASC"]],
    });

    const formatted = pendingAlumni.map((alumni) => ({
      id: alumni.id,
      name: alumni.name,
      email: alumni.email,
      phone: alumni.phone,
      userType: alumni.userType,
      profilePhoto: alumni.profilePhoto || null,
      alumniResume: alumni.resume || null,
      profileResume: alumni.profile?.resume || null,
      profile: alumni.profile || {},
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching unverified alumni:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching unverified alumni.",
      error: error.message,
    });
  }
};

export const verifyAlumniStatus = async (req, res) => {
  try {
    const { id } = req.params; // alumni ID
    const { action } = req.body; // 'accept' or 'reject'

    const alumni = await Alumni.findByPk(id);
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found.",
      });
    }

    if (action === "accept") {
      alumni.isVerified = true;
      await alumni.save();

      return res.status(200).json({
        success: true,
        message: `Alumni ${alumni.name} has been verified successfully.`,
      });
    }

    if (action === "reject") {
      await alumni.destroy();

      return res.status(200).json({
        success: true,
        message: `Alumni ${alumni.name} has been rejected and removed.`,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid action. Use 'accept' or 'reject'.",
    });
  } catch (error) {
    console.error("Error verifying alumni:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while verifying alumni.",
      error: error.message,
    });
  }
};

import cloudinary from "cloudinary";
import { google } from "googleapis";
import { Readable } from "stream";
import multer from "multer";

// ==================== CLOUDINARY CONFIG ====================
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==================== GOOGLE DRIVE CONFIG ====================
const oauth2Client = new google.auth.OAuth2(
  process.env.GDRIVE_OAUTH_CLIENT_ID,
  process.env.GDRIVE_OAUTH_CLIENT_SECRET,
  process.env.GDRIVE_OAUTH_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GDRIVE_REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

// ==================== MULTER CONFIG ====================
const storage = multer.memoryStorage();
// Configure multer for file upload
export const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory as buffer
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, and JPG files are allowed"), false);
    }
  },
});

// ==================== PROFILE PHOTO UPLOAD (CLOUDINARY) ====================
export const uploadProfilePhoto = async (req, res) => {
  try {
    const { userType, id: userId } = req.user;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!userType || !userId) {
      return res.status(400).json({ message: "Missing userType or userId" });
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({ message: "Only JPEG and PNG images are allowed" });
    }

    console.log("📸 Uploading profile photo to Cloudinary...");

    // Unique public_id: "profiles/userType_userId"
    const publicId = `profiles/${userType}_${userId}`;

    // Upload to Cloudinary using stream
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        public_id: publicId,
        overwrite: true, // Replace old image if re-uploaded
        folder: "profiles",
      },
      async (error, uploadResult) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          return res
            .status(500)
            .json({ message: "Error uploading to Cloudinary" });
        }

        const imageUrl = uploadResult.secure_url;
        console.log("✅ Uploaded to Cloudinary:", imageUrl);

        // Update database
        try {
          if (userType === "alumni") {
            await Alumni.update(
              { profilePhoto: imageUrl },
              { where: { id: userId } }
            );
          } else if (userType === "student") {
            await Student.update(
              { profilePhoto: imageUrl },
              { where: { id: userId } }
            );
          }

          console.log("✅ Database updated successfully");

          return res.status(200).json({
            message: "Profile photo uploaded successfully",
            photoUrl: imageUrl,
          });
        } catch (dbError) {
          console.error("❌ Database Error:", dbError);
          return res.status(500).json({ message: "Error updating database" });
        }
      }
    );

    // End the stream with the file buffer
    stream.end(req.file.buffer);
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// ==================== RESUME UPLOAD (GOOGLE DRIVE) ====================

export const uploadResume = async (req, res) => {
  try {
    const { userType, id: userId } = req.user;

    // Validation checks
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!userType || !userId) {
      return res.status(400).json({ message: "Missing userType or userId" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Resume must be a PDF file" });
    }

    // Check file size (e.g., 5MB limit)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxFileSize) {
      return res
        .status(400)
        .json({ message: "File size too large. Maximum 5MB allowed." });
    }

    const fileName = `${userType}_${userId}_${Date.now()}_resume.pdf`;

    console.log("📄 Uploading resume to Google Drive:", fileName);

    // Convert buffer to stream
    const bufferStream = Readable.from(req.file.buffer);

    const fileMetadata = {
      name: fileName,
      parents: [process.env.GDRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: "application/pdf",
      body: bufferStream,
    };

    // Upload to Google Drive
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, name, webViewLink",
    });

    const fileId = file.data.id;
    console.log("✅ Uploaded to Google Drive with ID:", fileId);

    // Make file publicly viewable
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Get the direct download URL
    const resumeUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;

    // Update database based on user type
    let updatedRecord;
    if (userType === "alumni") {
      updatedRecord = await Alumni.update(
        { resume: resumeUrl },
        { where: { id: userId } }
      );
    } else if (userType === "student") {
      updatedRecord = await Student.update(
        { resume: resumeUrl },
        { where: { id: userId } }
      );
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Check if database update was successful
    if (updatedRecord[0] === 0) {
      console.warn("⚠️ Database update affected 0 rows for user:", userId);
    }

    console.log("✅ Resume uploaded and database updated successfully");

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl: resumeUrl,
      fileId: fileId,
      fileName: fileName,
    });
  } catch (err) {
    console.error("❌ Resume Upload Error:", err);

    // More specific error handling
    if (err.code === 403) {
      return res.status(500).json({
        message: "Google Drive access denied. Check permissions.",
        error: err.message,
      });
    } else if (err.code === 404) {
      return res.status(500).json({
        message: "Google Drive folder not found.",
        error: err.message,
      });
    }

    res.status(500).json({
      message: "Internal server error during resume upload",
      error: err.message,
    });
  }
};
import axios from "axios";

// ✅ Use environment variable for API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// ✅ Rate limiting setup
let requestCount = 0;
let lastResetTime = Date.now();
const MAX_REQUESTS_PER_MINUTE = 10;

const checkRateLimit = () => {
  const now = Date.now();
  if (now - lastResetTime > 60000) {
    // 1 minute passed
    requestCount = 0;
    lastResetTime = now;
  }

  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error("Rate limit exceeded. Please try again in a moment.");
  }

  requestCount++;
};

/**
 * Analyze skills match with rate limiting and better error handling
 */
export const analyzeSkillsMatch = async (req, res) => {
  try {
    const { jobSkills, jobTitle } = req.body;
    const { id, userType } = req.user || {};

    // ✅ Validate environment variable
    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key not configured",
      });
    }

    // ✅ Validate input
    if (!Array.isArray(jobSkills) || jobSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "jobSkills array is required and cannot be empty",
      });
    }

    // ✅ Check rate limit
    try {
      checkRateLimit();
    } catch (rateLimitError) {
      return res.status(429).json({
        success: false,
        message: rateLimitError.message,
      });
    }

    // ✅ Fetch user profile skills
    let userSkills = [];
    if (userType === "student") {
      const student = await StudentProfile.findOne({
        where: { id },
        attributes: ["skills"],
      });
      if (student?.skills) userSkills = student.skills;
    } else if (userType === "alumni") {
      const alumni = await AlumniProfile.findOne({
        where: { id },
        attributes: ["skills"],
      });
      if (alumni?.skills) userSkills = alumni.skills;
    }

    // ✅ Handle missing user skills
    if (!userSkills.length) {
      return res.status(400).json({
        success: false,
        message: "User has no skills to compare.",
      });
    }

    // ✅ Build intelligent prompt
    const prompt = `
You are an expert career assistant. Compare the user's skills with the required job skills for the role "${
      jobTitle || "unspecified job"
    }".

Rules for scoring:
- Score realistically based on how many job skills the user actually has.
- Give 10/10 only if **every job skill** is covered by user skills.
- If skills are partially matched, lower the score (e.g., 6/10 or 7/10).
- Be objective — don't be overly optimistic.
- Always return **only JSON**, nothing else — no extra text or newlines.

User Skills: ${JSON.stringify(userSkills)}
Job Skills: ${JSON.stringify(jobSkills)}

Respond strictly in this JSON format:
{
  "score": "X/10",
  "jobOverview": "short description of the job and its expectations",
  "strongMatches": "comma separated list of skills that match strongly",
  "missingSkills": "comma separated list of missing or weak skills",
  "howToCoverMissing": "specific ways the user can learn or improve those skills",
  "overallGuide": "a realistic evaluation of readiness for the job",
  "learningPlan": "short learning roadmap"
}
`;

    // ✅ Call Gemini API with better error handling
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
        },
      },
      {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Extract Gemini raw text
    const geminiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!geminiText) {
      return res.status(500).json({
        success: false,
        message: "No response received from Gemini API.",
      });
    }

    // ✅ Clean and Parse JSON (remove \n, ``` etc.)
    let cleaned = geminiText
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .replace(/\n/g, "")
      .trim();

    let analysis;
    try {
      analysis = JSON.parse(cleaned);
    } catch (err) {
      console.error("⚠️ JSON Parse Error — returning raw text:", cleaned);
      return res.status(500).json({
        success: false,
        message: "Gemini API did not return valid JSON.",
        rawResponse: cleaned,
      });
    }

    // ✅ Return final JSON response
    return res.status(200).json({
      success: true,
      message: "Skill analysis completed successfully",
      data: {
        userSkills,
        jobSkills,
        jobTitle,
        analysis,
      },
    });
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);

    // ✅ Handle specific error types
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please wait a moment and try again.",
        retryAfter: "60 seconds",
      });
    }

    if (error.code === "ECONNABORTED") {
      return res.status(408).json({
        success: false,
        message: "Request timeout. Please try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to get analysis from Gemini API",
      error: error.message,
    });
  }
};

import https from "https";
import puppeteer from "puppeteer";
export const getLinkedInProfileByUrl = async (req, res) => {
  let browser;
  try {
    const { url } = req.query;

    // Validate URL parameter
    if (!url) {
      return res.status(400).json({
        message: "URL parameter is required",
        example: "?url=https://www.linkedin.com/in/harsh-manmode-2a0b91325",
      });
    }

    // Validate LinkedIn URL
    if (!url.includes("linkedin.com/in/")) {
      return res.status(400).json({
        message: "Invalid LinkedIn profile URL",
        example: "?url=https://www.linkedin.com/in/username",
      });
    }

    // Launch puppeteer browser
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920x1080",
      ],
    });

    const page = await browser.newPage();

    // Set user agent to mimic real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to LinkedIn profile
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait a bit for dynamic content
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Extract profile data
    const profileData = await page.evaluate(() => {
      const data = {
        name: null,
        headline: null,
        location: null,
        about: null,
        profileImage: null,
        connections: null,
        experience: [],
        education: [],
        skills: [],
      };

      // Extract name
      const nameElement = document.querySelector(
        "h1.text-heading-xlarge, h1.top-card-layout__title"
      );
      if (nameElement) data.name = nameElement.innerText.trim();

      // Extract headline
      const headlineElement = document.querySelector(
        ".text-body-medium.break-words, .top-card-layout__headline"
      );
      if (headlineElement) data.headline = headlineElement.innerText.trim();

      // Extract location
      const locationElement = document.querySelector(
        ".text-body-small.inline.t-black--light.break-words, .top-card__subline-item"
      );
      if (locationElement) data.location = locationElement.innerText.trim();

      // Extract about
      const aboutElement = document.querySelector(
        '#about ~ .display-flex .inline-show-more-text span[aria-hidden="true"]'
      );
      if (aboutElement) data.about = aboutElement.innerText.trim();

      // Extract profile image
      const imageElement = document.querySelector(
        "img.pv-top-card-profile-picture__image, img.profile-photo-edit__preview"
      );
      if (imageElement) data.profileImage = imageElement.src;

      // Extract connections
      const connectionsElement = document.querySelector(
        ".pv-top-card--list-bullet li"
      );
      if (connectionsElement) {
        const text = connectionsElement.innerText;
        const match = text.match(/(\d+[\+]?)\s+connection/i);
        if (match) data.connections = match[1];
      }

      // Extract experience
      const experienceSection = document.querySelector("#experience");
      if (experienceSection) {
        const experienceItems =
          experienceSection.parentElement.querySelectorAll(
            "ul li.artdeco-list__item"
          );
        experienceItems.forEach((item, index) => {
          if (index < 5) {
            const position = item.querySelector(
              '.mr1.t-bold span[aria-hidden="true"]'
            );
            const company = item.querySelector(
              '.t-14.t-normal span[aria-hidden="true"]'
            );
            if (position && company) {
              data.experience.push({
                position: position.innerText.trim(),
                company: company.innerText.trim(),
              });
            }
          }
        });
      }

      // Extract education
      const educationSection = document.querySelector("#education");
      if (educationSection) {
        const educationItems = educationSection.parentElement.querySelectorAll(
          "ul li.artdeco-list__item"
        );
        educationItems.forEach((item, index) => {
          if (index < 3) {
            const school = item.querySelector(
              '.mr1.hoverable-link-text.t-bold span[aria-hidden="true"]'
            );
            const degree = item.querySelector(
              '.t-14.t-normal span[aria-hidden="true"]'
            );
            if (school) {
              data.education.push({
                school: school.innerText.trim(),
                degree: degree ? degree.innerText.trim() : null,
              });
            }
          }
        });
      }

      // Extract skills
      const skillsSection = document.querySelector("#skills");
      if (skillsSection) {
        const skillItems = skillsSection.parentElement.querySelectorAll(
          "ul li.artdeco-list__item"
        );
        skillItems.forEach((item, index) => {
          if (index < 10) {
            const skill = item.querySelector(
              '.mr1.hoverable-link-text.t-bold span[aria-hidden="true"]'
            );
            if (skill) {
              data.skills.push(skill.innerText.trim());
            }
          }
        });
      }

      return data;
    });

    await browser.close();

    return res.status(200).json({
      success: true,
      url,
      data: profileData,
    });
  } catch (error) {
    if (browser) await browser.close();

    console.error("LinkedIn scraper error:", error);
    return res.status(500).json({
      success: false,
      message:
        "Failed to scrape profile. LinkedIn may require login or the profile is private.",
      error: error.message,
    });
  }
};
