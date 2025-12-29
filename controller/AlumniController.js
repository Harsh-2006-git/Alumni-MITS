import UserProfile from "../models/UserProfile.js";
import User from "../models/user.js";
import cloudinary from "cloudinary";
import { google } from "googleapis";
import { Readable } from "stream";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import puppeteer from "puppeteer";

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
// Configure multer for file upload
export const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory as buffer
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only apply filter if it's an image upload
    if (file.fieldname === "profilePhoto") {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only PNG, and JPG files are allowed"), false);
      }
    } else {
      cb(null, true);
    }
  },
});

// ==================== ALUMNI CONTROLLERS ====================

export const getAllAlumni = async (req, res) => {
  try {
    // Find all users with userType 'alumni' and isVerified true
    const alumniList = await User.find({ userType: "alumni", isVerified: true })
      .select("-password")
      .sort({ _id: 1 });

    // Get all alumni IDs for batch profile lookup
    const alumniIds = alumniList.map((alumni) => alumni._id);

    // Fetch all profiles in one query
    const profiles = await UserProfile.find({ userId: { $in: alumniIds } });

    // Create a map for quick profile lookup
    const profileMap = new Map();
    profiles.forEach((profile) => {
      profileMap.set(profile.userId.toString(), profile);
    });

    // Combine alumni with their profiles
    const formattedAlumni = alumniList.map((alumni) => {
      const profile = profileMap.get(alumni._id.toString());
      return {
        id: alumni._id,
        name: alumni.name,
        email: alumni.email,
        phone: alumni.phone,
        currentRole: profile?.experience?.[0]?.role || "N/A",
        company: profile?.experience?.[0]?.company || "N/A",
        location: profile?.location || "N/A",
        linkedin: profile?.linkedin || null,
        isVerified: alumni.isVerified,
        userType: alumni.userType,
        profilePhoto: alumni.profilePhoto || null,
        alumniResume: alumni.resume || null,
        profileResume: null, // Unified resume in user model
        batch: alumni.batch || profile?.batch || null, // Prefer batch from User, fallback to Profile
        createdAt: alumni.createdAt,
        profile: profile || {},
      };
    });

    // Secure the response:
    // If user is NOT authenticated, strip sensitive details
    let responseData = formattedAlumni;

    if (!req.isAuthenticated) {
      responseData = formattedAlumni.map((alumni) => {
        const restricted = { ...alumni };

        // Explicitly remove sensitive fields
        delete restricted.email;
        delete restricted.phone;
        delete restricted.linkedin;
        delete restricted.alumniResume;
        delete restricted.profileResume;

        // Sanitize nested profile object if present
        if (restricted.profile) {
          // Ensure we work with a plain object
          const profileObj = restricted.profile.toObject
            ? restricted.profile.toObject()
            : { ...restricted.profile };

          delete profileObj.linkedin;
          delete profileObj.email;
          delete profileObj.phone;

          restricted.profile = profileObj;
        }

        return restricted;
      });
    }

    res.status(200).json({
      success: true,
      count: responseData.length,
      data: responseData,
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
    // Find all users with userType 'alumni' (including unverified)
    const alumniList = await User.find({ userType: "alumni" })
      .select("-password")
      .sort({ _id: 1 });

    // Get all alumni IDs for batch profile lookup
    const alumniIds = alumniList.map((alumni) => alumni._id);

    // Fetch all profiles in one query
    const profiles = await UserProfile.find({ userId: { $in: alumniIds } });

    // Create a map for quick profile lookup
    const profileMap = new Map();
    profiles.forEach((profile) => {
      profileMap.set(profile.userId.toString(), profile);
    });

    // Combine alumni with their profiles
    const formattedAlumni = alumniList.map((alumni) => {
      const profile = profileMap.get(alumni._id.toString());
      return {
        id: alumni._id,
        name: alumni.name,
        email: alumni.email,
        phone: alumni.phone,
        currentRole: profile?.experience?.[0]?.role || "N/A",
        company: profile?.experience?.[0]?.company || "N/A",
        location: profile?.location || "N/A",
        linkedin: profile?.linkedin || null,
        isVerified: alumni.isVerified,
        userType: alumni.userType,
        profilePhoto: alumni.profilePhoto || null,
        alumniResume: alumni.resume || null,
        profileResume: null,
        batch: alumni.batch || profile?.batch || null,
        createdAt: alumni.createdAt,
        profile: profile || {},
      };
    });

    res.status(200).json({
      success: true,
      count: formattedAlumni.length,
      data: formattedAlumni,
    });
  } catch (error) {
    console.error("Error fetching all alumni (admin):", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching alumni.",
      error: error.message,
    });
  }
};

export const getUnverifiedAlumni = async (req, res) => {
  try {
    const pendingAlumni = await User.find({ userType: "alumni", isVerified: false })
      .select("-password")
      .sort({ _id: 1 });

    // Get all alumni IDs for batch profile lookup
    const alumniIds = pendingAlumni.map((alumni) => alumni._id);

    // Fetch all profiles in one query
    const profiles = await UserProfile.find({ userId: { $in: alumniIds } });

    // Create a map for quick profile lookup
    const profileMap = new Map();
    profiles.forEach((profile) => {
      profileMap.set(profile.userId.toString(), profile);
    });

    const formatted = pendingAlumni.map((alumni) => {
      const profile = profileMap.get(alumni._id.toString());
      return {
        id: alumni._id,
        name: alumni.name,
        email: alumni.email,
        phone: alumni.phone,
        userType: alumni.userType,
        profilePhoto: alumni.profilePhoto || null,
        alumniResume: alumni.resume || null,
        profileResume: null,
        createdAt: alumni.createdAt,
        profile: profile || {},
      };
    });

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
    const { id } = req.params; // alumni/user ID
    const { action } = req.body; // 'accept' or 'reject'

    const alumni = await User.findById(id);
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found.",
      });
    }

    // Ensure it is actually an alumni
    if (alumni.userType !== "alumni") {
      return res.status(400).json({
        success: false,
        message: "User is not an alumni.",
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
      // Delete profile first
      await UserProfile.deleteOne({ userId: id });
      // Delete user
      await User.findByIdAndDelete(id);

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
    const alumni = await User.findById(id);
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    try {
      // Delete user profile first
      await UserProfile.deleteOne({ userId: id });

      // Delete user record
      await User.findByIdAndDelete(id);

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

    // Fetch alumni
    const alumni = await User.findById(id);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    // Fetch profile
    const profile = await UserProfile.findOne({ userId: id });

    res.status(200).json({
      message: "Alumni details fetched successfully",
      alumni: {
        ...alumni.toJSON(),
        profile: profile || {},
      },
    });
  } catch (error) {
    console.error("Error fetching alumni details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
    let profile = await UserProfile.findOne({ userId: alumniId });

    if (profile) {
      // Update existing profile
      profile = await UserProfile.findOneAndUpdate(
        { userId: alumniId },
        {
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
        },
        { new: true }
      );
    } else {
      // Create new profile
      profile = await UserProfile.create({
        userId: alumniId,
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

// ==================== STUDENT CONTROLLERS ====================

export const getStudentProfile = async (req, res) => {
  try {
    const { id, userType } = req.user;

    // Ensure only students can access this route
    if (!id || userType !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Fetch student
    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fetch profile
    const profile = await UserProfile.findOne({ userId: id });

    res.status(200).json({
      message: "Student details fetched successfully",
      student: {
        ...student.toJSON(),
        profile: profile || {},
      },
    });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Internal server error" });
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
    let profile = await UserProfile.findOne({ userId: studentId });

    if (profile) {
      // Update existing profile
      profile = await UserProfile.findOneAndUpdate(
        { userId: studentId },
        {
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
        },
        { new: true }
      );
    } else {
      // Create new profile
      profile = await UserProfile.create({
        userId: studentId,
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

    // Also update basic info in User model for easier searching
    await User.findByIdAndUpdate(studentId, {
      branch: branch || null,
      batch: education?.[0]?.to?.split("-")?.[0] || null // Try to get batch from education if not provided directly
    });

    res.status(200).json({
      message: "Student profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Error saving student profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== PROFILE PHOTO UPLOAD (CLOUDINARY) ====================
export const uploadProfilePhoto = async (req, res) => {
  try {
    const { userType, id: userId } = req.user;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({ message: "Only JPEG and PNG images are allowed" });
    }

    console.log("📸 Uploading profile photo to Cloudinary...");

    // Unique public_id: "profiles/userType_userId"
    const publicId = `profiles/${userType || 'user'}_${userId}`;

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

        // Update database (Unified User)
        try {
          await User.findByIdAndUpdate(userId, { profilePhoto: imageUrl });

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

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Resume must be a PDF file" });
    }

    // Check file size (e.g., 5MB limit)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxFileSize) {
      return res
        .status(400)
        .json({ message: "File size exceeds 5MB limit" });
    }

    console.log("📄 Uploading resume to Google Drive...");

    const fileMetadata = {
      name: `Resume_${userType}_${userId}.pdf`,
      parents: [process.env.GDRIVE_FOLDER_ID], // Save in specific folder
    };

    const media = {
      mimeType: req.file.mimetype,
      body: Readable.from(req.file.buffer),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    const fileId = response.data.id;
    const resumeUrl = response.data.webViewLink; // Link to view file

    // Make file readable by anyone with the link (Optional)
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    console.log(`✅ Resume uploaded! ID: ${fileId}, URL: ${resumeUrl}`);

    // Update database (Unified User)
    const updatedRecord = await User.findByIdAndUpdate(userId, {
      resume: resumeUrl,
    });

    // Check if database update was successful
    if (!updatedRecord) {
      console.warn("⚠️ Database update affected 0 rows for user:", userId);
    }

    console.log("✅ Resume uploaded and database updated successfully");

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl: resumeUrl,
      fileId: fileId,
      fileName: `Resume_${userType}_${userId}.pdf`,
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

// ==================== AI SKILLS MATCH (GEMINI) ====================

// ✅ Initialize GoogleGenAI with API key from environment variable
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ Rate limiting setup - increased limits
let requestCount = 0;
let lastResetTime = Date.now();
const MAX_REQUESTS_PER_MINUTE = 60; // Increased from 10 to 60

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
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key not configured",
      });
    }

    // ✅ Validate input
    if (!Array.isArray(jobSkills) || jobSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Job skills are required and must be an array",
      });
    }

    // ✅ Fetch user profile skills (Unified UserProfile)
    let userSkills = [];
    if (id) {
      const profile = await UserProfile.findOne({ userId: id });
      if (profile?.skills) userSkills = profile.skills;
    }

    // If user has no skills listed, we can't analyze much, but we shouldn't fail hard.
    // We can proceed with empty userSkills and let AI say 0% match.

    // ✅ Check rate limit before calling API
    try {
      checkRateLimit();
    } catch (rateLimitError) {
      return res.status(429).json({
        success: false,
        message: rateLimitError.message,
        retryAfter: "60 seconds",
      });
    }

    // ✅ Construct prompt for Gemini
    const systemPrompt = `
      You are an expert AI Career Coach and HR Specialist. 
      Your task is to analyze the match between a candidate's skills and a job description.
      
      Job Title: ${jobTitle || "Not specified"}
      Required Skills: ${jobSkills.join(", ")}
      Candidate Skills: ${userSkills.length > 0 ? userSkills.join(", ") : "None listed"}
      
      Provide a structured JSON response with:
      1. "matchPercentage": A number between 0 and 100 representing the relevance of candidate skills to the job.
      2. "missingSkills": A list of critical skills the candidate is missing.
      3. "recommendation": A brief, encouraging advice on what to learn or improve (max 2 sentences).
      4. "marketDemand": A short insight on the demand for these skills in the current market (max 1 sentence).
      
      Output ONLY valid JSON. Do not add markdown formatting or extra text.
    `;

    // ✅ Call Gemini API
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Add timeout to prevented hanging requests
    const result = await Promise.race([
      model.generateContent(systemPrompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 10000)
      )
    ]);

    const response = await result.response;
    let text = response.text();

    // Clean up response if it wraps in markdown code blocks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const analysisData = JSON.parse(text);

    return res.status(200).json({
      success: true,
      matchPercentage: analysisData.matchPercentage || 0,
      missingSkills: analysisData.missingSkills || [],
      recommendation: analysisData.recommendation || "Update your profile with more skills.",
      marketDemand: analysisData.marketDemand || "These skills are in demand.",
    });

  } catch (error) {
    console.error("Gemini Analysis Error:", error);

    // Handle specific error types
    if (
      error.message?.includes("RATE_LIMIT_EXCEEDED") ||
      error.status === 429
    ) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please wait a moment and try again.",
        retryAfter: "60 seconds",
      });
    }

    if (error.code === "ECONNABORTED" || error.message === "Request timeout") {
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

// ==================== LINKEDIN PROFILE FETCHING ====================

export const getLinkedInProfileByUrl = async (req, res) => {
  let browser;
  try {
    const { url } = req.query;

    // Validate URL parameter
    if (!url) {
      return res.status(400).json({
        message: "URL parameter is required",
        example: "?url=https://www.linkedin.com/in/username",
      });
    }

    // Validate LinkedIn URL
    if (!url.includes("linkedin.com/in/")) {
      return res.status(400).json({
        message: "Invalid LinkedIn profile URL",
        example: "?url=https://www.linkedin.com/in/username",
      });
    }

    // THIS FUNCTIONALITY MIGHT BREAK IF LINKEDIN CHANGES DOM STRUCTURE
    // USING PUPPETEER FOR SCRAPING
    // NOTE: Scraping LinkedIn is against their TOS. Proceed with caution or use official API.
    // For this educational/internal project, we attempt scraping.

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Extract public data (limited view without login)
    const data = await page.evaluate(() => {
      const name = document.querySelector(".top-card-layout__title")?.innerText || "";
      const headline = document.querySelector(".top-card-layout__headline")?.innerText || "";
      const about = document.querySelector(".core-section-container__content .break-words")?.innerText || "";
      return { name, headline, about };
    });

    await browser.close();

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    if (browser) await browser.close();
    console.error("LinkedIn Scraping Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch LinkedIn profile",
      error: error.message,
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const { branch, batch, skills, name } = req.query;

    // Build query - only basic filters for initial fetch
    const query = { userType: "student" };
    if (name) query.name = { $regex: name, $options: "i" };
    // Branch and batch will be filtered in code to handle fallback to UserProfile

    const studentsList = await User.find(query)
      .select("-password")
      .sort({ name: 1 });

    const studentIds = studentsList.map((s) => s._id);

    // Build profile query
    const profileQuery = { userId: { $in: studentIds } };

    // Fetch all profiles first to filter by skills if needed
    const profiles = await UserProfile.find(profileQuery);

    const profileMap = new Map();
    profiles.forEach((profile) => {
      profileMap.set(profile.userId.toString(), profile);
    });

    // Combine and filter
    const formattedStudents = studentsList
      .map((student) => {
        const profile = profileMap.get(student._id.toString());

        const finalBranch = student.branch || profile?.branch || "N/A";
        const finalBatch = student.batch || profile?.batch || "N/A";

        // Filtering in code because branch/batch might be in either model
        if (branch && branch !== "All Branches" && finalBranch !== branch) return null;
        if (batch && batch !== "All Batches" && finalBatch !== batch) return null;

        // Manual skills filtering if provided
        if (skills) {
          const skillsArray = skills.toLowerCase().split(",").map(s => s.trim());
          const studentSkills = (profile?.skills || []).map(s => s.toLowerCase());
          const hasAllSkills = skillsArray.every(skill => studentSkills.some(ss => ss.includes(skill)));
          if (!hasAllSkills) return null;
        }

        return {
          id: student._id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          branch: finalBranch,
          batch: finalBatch,
          location: profile?.location || "N/A",
          skills: profile?.skills || [],
          linkedin: profile?.linkedin || null,
          github: profile?.github || null,
          profilePhoto: student.profilePhoto || null,
          resume: student.resume || null,
          about: profile?.about || "",
          createdAt: student.createdAt,
          education: profile?.education || [],
          experience: profile?.experience || [],
        };
      })
      .filter((s) => s !== null);

    res.status(200).json({
      success: true,
      count: formattedStudents.length,
      data: formattedStudents,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching students.",
      error: error.message,
    });
  }
};
