import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import UserProfile from "../models/UserProfile.js";
import EmailService from "../services/NewUserEmailService.js"; // Add email service import
import csv from "csv-parser";
import multer from "multer";
import { Readable } from "stream";
import nodemailer from "nodemailer";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Initialize Email Service
const emailService = new EmailService();

// In-memory refresh tokens (replace with DB in production)
let refreshTokens = [];

// ===================== GENERATE TOKENS =====================
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    userType: user.userType || "student",
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  refreshTokens.push(refreshToken);

  return { accessToken, refreshToken };
};

const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  email: "admin@mits.edu",
  name: "MITS Admin",
  userType: "admin",
};

const generateTokensAdmin = (adminPayload) => {
  const accessToken = jwt.sign(adminPayload, JWT_SECRET, {
    expiresIn: "30m", // short-lived token for requests
  });

  const refreshToken = jwt.sign(adminPayload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // long-lived refresh token
  });

  return { accessToken, refreshToken };
};

// ✅ Admin Login Controller
// ✅ Admin Login Controller
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate credentials
    if (
      username !== ADMIN_CREDENTIALS.username ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Full admin info as JWT payload
    const adminPayload = {
      name: ADMIN_CREDENTIALS.name,
      username: ADMIN_CREDENTIALS.username,
      email: ADMIN_CREDENTIALS.email,
      userType: ADMIN_CREDENTIALS.userType,
      loginTime: new Date().toISOString(),
    };

    // Generate tokens
    const { accessToken, refreshToken } = generateTokensAdmin(adminPayload);

    return res.status(200).json({
      message: "Admin login successful",
      admin: adminPayload,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===================== GOOGLE OAUTH =====================
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      state: false,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        if (!email.endsWith("@mitsgwl.ac.in")) {
          return done(null, false, { message: "unauthorized_domain" });
        }

        let user = await User.findOne({ email });
        if (!user) {
          const randomPassword = await bcrypt.hash(
            Math.random().toString(36).slice(-12),
            10
          );
          const phone = `9999${Date.now().toString().slice(-6)}`;
          user = await User.create({
            name: profile.displayName,
            email,
            phone,
            password: randomPassword,
            userType: "student",
            isVerified: true, // Auto-verify students
          });

          // ✅ Send welcome email for Google OAuth registration (non-blocking)
          emailService.sendWelcomeEmail(user).catch((error) => {
            console.error(
              "Failed to send welcome email for OAuth user:",
              error
            );
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
  accessType: "offline",
});

export const googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err || !user) {
      const error = info?.message || "unauthorized";
      return res.redirect(`${FRONTEND_URL}/login?error=${error}`);
    }

    // Check if student profile is complete
    if (!user.isProfileComplete) {
      // Create a temporary identifier/token if needed, or just use the user ID
      const regUrl = new URL(`${FRONTEND_URL}/login`);
      regUrl.searchParams.set("needsRegistration", "true");
      regUrl.searchParams.set("name", encodeURIComponent(user.name));
      regUrl.searchParams.set("email", user.email);
      regUrl.searchParams.set("id", user.id.toString());
      // We pass the accessToken anyway so the frontend can use it to call the register endpoint
      const { accessToken, refreshToken } = generateTokens(user);
      regUrl.searchParams.set("accessToken", accessToken);

      return res.redirect(regUrl.toString());
    }

    const { accessToken, refreshToken } = generateTokens(user);

    const redirectUrl = new URL(`${FRONTEND_URL}/login`);
    redirectUrl.searchParams.set("accessToken", accessToken);
    redirectUrl.searchParams.set("refreshToken", refreshToken);
    redirectUrl.searchParams.set("name", encodeURIComponent(user.name));
    redirectUrl.searchParams.set("email", user.email);
    redirectUrl.searchParams.set("id", user.id.toString());
    redirectUrl.searchParams.set("userType", user.userType);
    if (user.phone) {
      redirectUrl.searchParams.set("phone", user.phone);
    }

    res.redirect(redirectUrl.toString());
  })(req, res, next);
};

// ===================== GOOGLE OAUTH FOR ALUMNI =====================
passport.use(
  "google-alumni",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL, // Use same callback as students
      state: false,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // Check if user exists with this email and is alumni
        let user = await User.findOne({ email: email.toLowerCase(), userType: "alumni" });

        if (!user) {
          return done(null, false, { message: "alumni_not_registered" });
        }

        // Check verification
        if (!user.isVerified) {
          return done(null, false, { message: "alumni_not_verified" });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export const googleAuthAlumni = (req, res, next) => {
  passport.authenticate("google-alumni", {
    scope: ["profile", "email"],
    prompt: "select_account",
    accessType: "offline",
    state: "alumni",
  })(req, res, next);
};

export const googleCallbackAlumni = (req, res, next) => {
  passport.authenticate("google-alumni", { session: false }, (err, user, info) => {
    if (err || !user) {
      const error = info?.message || "unauthorized";
      console.error("❌ Alumni OAuth Error:", error, info);
      return res.redirect(`${FRONTEND_URL}/auth-alumni?error=${error}`);
    }

    console.log("✅ Alumni OAuth Success - User:", { id: user.id, email: user.email, name: user.name });

    const { accessToken, refreshToken } = generateTokens(user);

    console.log("🔑 Generated Tokens:", {
      accessToken: accessToken.substring(0, 20) + "...",
      refreshToken: refreshToken.substring(0, 20) + "..."
    });

    const redirectUrl = new URL(`${FRONTEND_URL}/auth-alumni`);
    redirectUrl.searchParams.set("accessToken", accessToken);
    redirectUrl.searchParams.set("refreshToken", refreshToken);
    redirectUrl.searchParams.set("name", encodeURIComponent(user.name));
    redirectUrl.searchParams.set("email", user.email);
    redirectUrl.searchParams.set("id", user.id.toString());
    redirectUrl.searchParams.set("userType", user.userType);
    if (user.phone) {
      redirectUrl.searchParams.set("phone", user.phone);
    }
    if (user.profilePhoto) {
      redirectUrl.searchParams.set("profilePhoto", encodeURIComponent(user.profilePhoto));
    }

    console.log("🔄 Redirecting to:", redirectUrl.toString().substring(0, 100) + "...");
    res.redirect(redirectUrl.toString());
  })(req, res, next);
};

// ===================== GOOGLE OAUTH FOR ALUMNI REGISTRATION =====================
passport.use(
  "google-register",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // For registration, we just want the profile data
        // We will validate if the email already exists in the controller callback logic or frontend
        return done(null, profile);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export const googleAuthAlumniRegister = (req, res, next) => {
  passport.authenticate("google-register", {
    scope: ["profile", "email"],
    prompt: "select_account",
    accessType: "offline",
    state: "alumni-register",
  })(req, res, next);
};

export const googleCallbackAlumniRegister = (req, res, next) => {
  // Use the google-register strategy
  passport.authenticate("google-register", { session: false }, async (err, user, info) => {
    if (err) {
      console.error("❌ Alumni OAuth Registration Error:", err);
      return res.redirect(`${FRONTEND_URL}/auth-alumni?error=oauth_failed`);
    }

    // user is the profile object returned from the strategy
    const email = user?.emails?.[0]?.value;
    const name = user?.displayName;

    if (!email) {
      return res.redirect(`${FRONTEND_URL}/auth-alumni?error=no_email`);
    }

    console.log("✅ Google OAuth Registration - Email:", email, "Name:", name);

    // Initial check if email is already taken (backend side check)
    // We can do this here to give immediate feedback or let the frontend handle it
    // Let's do a quick check to fail fast if it's an existing ALUMNI
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ Email already registered:", email);
      return res.redirect(`${FRONTEND_URL}/auth-alumni?error=email_exists`);
    }

    // Redirect to registration form with pre-filled data
    const redirectUrl = new URL(`${FRONTEND_URL}/auth-alumni`);
    redirectUrl.searchParams.set("register", "true");
    redirectUrl.searchParams.set("googleEmail", encodeURIComponent(email));
    redirectUrl.searchParams.set("googleName", encodeURIComponent(name || ""));

    // Generate a temporary verification token (optional, but good for security)
    // For now, we trust the redirect parameters as they come from this successful callback

    console.log("🔄 Redirecting to registration form");
    res.redirect(redirectUrl.toString());
  })(req, res, next);
};

// ===================== REGISTER / LOGIN STUDENT =====================
export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: "All fields required" });

    if (!email.endsWith("@mitsgwl.ac.in"))
      return res.status(403).json({ message: "Only @mitsgwl.ac.in allowed" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email exists" });

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) return res.status(409).json({ message: "Phone exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      userType: "student",
      isVerified: true, // Auto-verify students
      isProfileComplete: false,
    });

    const { accessToken, refreshToken } = generateTokens(user);

    // ✅ Send welcome email to student (non-blocking)
    emailService.sendWelcomeEmail(user).catch((error) => {
      console.error("Failed to send welcome email:", error);
      // Don't fail the registration if email fails
    });

    // Optional: set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Registered successfully",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);

    // ✅ Handle MongoDB duplicate key error (E11000)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      let message = "A duplicate record already exists.";

      if (field === "phone") {
        message = "This phone number is already registered.";
      } else if (field === "email") {
        message = "This email is already registered.";
      }

      return res.status(409).json({
        success: false,
        message
      });
    }

    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// ===================== REGISTER ALUMNI (Modified to match bulk registration but with manual password) =====================
export const registerAlumni = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      branch,
      batchYear,
      location,
      linkedinUrl,
    } = req.body;

    // Validate required fields (same as bulk registration but with password)
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !branch ||
      !batchYear ||
      !location ||
      !linkedinUrl
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields (name, email, phone, password, branch, or batchYear)",
      });
    }

    // Validate email (same validation as bulk)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Block college emails for alumni registration
    if (email.toLowerCase().endsWith("@mitsgwl.ac.in")) {
      return res.status(400).json({
        success: false,
        message: "College email (@mitsgwl.ac.in) is not allowed for alumni registration. Please use your personal email.",
      });
    }

    // Validate phone (same validation as bulk)
    const cleanedPhone = phone.toString().replace(/\D/g, "");
    if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    // Validate batch year (same validation as bulk)
    const batchRegex = /^\d{4}-\d{4}$/;
    if (!batchRegex.test(batchYear)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid batch year format. Use format: YYYY-YYYY (e.g., 2020-2024)",
      });
    }

    const [startYear, endYear] = batchYear.split("-").map(Number);
    const currentYear = new Date().getFullYear();

    if (
      !(
        startYear < endYear &&
        endYear - startYear <= 6 &&
        startYear >= 2000 &&
        endYear <= currentYear + 6
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch year range",
      });
    }

    // Check for existing records (same as bulk)
    const normalizedEmail = email.toLowerCase().trim();
    const sanitizedPhone = cleanedPhone.substring(0, 15);

    // CHECK USER MODEL
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: sanitizedPhone }]
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists in system",
        });
      }
      if (existingUser.phone === sanitizedPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number already exists in system",
        });
      }
    }

    // Sanitize inputs (same as bulk)
    const sanitizeInput = (input) => {
      if (typeof input !== "string") return input;
      return input.trim();
    };

    const sanitizeLinkedInUrl = (url) => {
      if (!url || url.trim() === "" || url === "Not provided") return null;

      let sanitizedUrl = url.trim();
      if (!sanitizedUrl.startsWith("http")) {
        sanitizedUrl = "https://" + sanitizedUrl;
      }

      const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/.+/i;
      if (!linkedinRegex.test(sanitizedUrl)) {
        return null;
      }

      return sanitizedUrl;
    };

    const sanitizeLocation = (location) => {
      if (!location || location.trim() === "" || location === "Not provided")
        return null;
      return location.trim();
    };

    // Generate education data from batch year (EXACT same format as bulk)
    const generateEducationFromBatch = (batchYear, branch) => {
      const [startYear, endYear] = batchYear.split("-").map(Number);

      const startDate = `${startYear}-08-01`; // 1st August of start year
      const endDate = `${endYear}-05-30`; // 30th May of end year

      const educationEntry = {
        type: "Bachelor",
        stream: branch,
        institution: "MITS Gwalior",
        from: startDate,
        to: endDate,
        gpa: "7.5",
      };

      return [educationEntry];
    };

    // Hash the provided password (NOT auto-generated)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Sanitize location and LinkedIn URL (same as bulk)
    const sanitizedLocation = sanitizeLocation(location);
    const sanitizedLinkedIn = sanitizeLinkedInUrl(linkedinUrl);

    // Generate education data (same as bulk)
    const education = generateEducationFromBatch(batchYear, branch);

    console.log(
      "Generated education (exact format):",
      JSON.stringify(education, null, 2)
    );

    // Create user record (Unified User Model)
    const user = await User.create({
      name: sanitizeInput(name),
      email: normalizedEmail,
      phone: sanitizedPhone,
      branch: sanitizeInput(branch), // Storing branch in User for easy access
      batch: sanitizeInput(batchYear), // Storing batch in User for easy access
      password: hashedPassword,
      userType: "alumni",
      isVerified: false, // Set to false for manual registration
    });

    // Create user profile with education data (Unified UserProfile)
    const userProfileData = {
      userId: user._id,
      branch: sanitizeInput(branch),
      batch: sanitizeInput(batchYear),
      location: sanitizedLocation,
      linkedin: sanitizedLinkedIn,
      education: education, // Same exact format as bulk registration
    };

    console.log("Creating profile with exact education format");

    await UserProfile.create(userProfileData);

    // Prepare user data for email
    const userWithCredentials = {
      ...user.toJSON(),
      batchYear: sanitizeInput(batchYear),
      location: sanitizedLocation,
      linkedinUrl: sanitizedLinkedIn,
      education: education,
    };

    // Send welcome email (same as bulk)
    try {
      await emailService.sendWelcomeEmail(userWithCredentials);
      console.log(`✅ Welcome email sent to ${user.email}`);
    } catch (emailError) {
      console.error(
        `❌ Failed to send welcome email to ${user.email}:`,
        emailError
      );
      // Don't fail registration if email fails (same as bulk)
    }

    // Generate tokens for immediate upload capability
    const { accessToken, refreshToken } = generateTokens(user);

    // Return response
    res.status(201).json({
      success: true,
      message:
        "Alumni registered successfully. Your account is under verification.",
      accessToken,
      refreshToken,
      data: {
        alumni: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          branch: user.branch,
          userType: user.userType,
          isVerified: user.isVerified,
        },
        profile: {
          batchYear: batchYear,
          location: sanitizedLocation || "Not provided",
          linkedinUrl: sanitizedLinkedIn || "Not provided",
          education: education,
        },
      },
    });
  } catch (error) {
    console.error("Alumni registration error:", error);

    // ✅ Handle MongoDB duplicate key error (E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      let message = "A duplicate record already exists.";

      if (field === "phone") {
        message = "This phone number is already associated with another account.";
      } else if (field === "email") {
        message = "This email is already registered.";
      }

      return res.status(409).json({
        success: false,
        message
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during alumni registration",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Configure multer for file upload

export const loginAlumni = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user of type alumni
    const user = await User.findOne({ email, userType: "alumni" });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check verification
    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Your account is under verification. Please wait for approval.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Generate Access Token (short life)
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        userType: user.userType,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Generate Refresh Token (long life)
    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        userType: user.userType,
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Option 1 (temporary): store in memory
    refreshTokens.push(refreshToken);

    // Send tokens
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          isVerified: user.isVerified,
          profilePhoto: user.profilePhoto,
        },
      });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===================== REFRESH TOKEN =====================
export const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token required" });
  }

  // Verify JWT signature and expiry only
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("JWT Verify Error:", err.message);
      return res.status(403).json({
        message: "Invalid or expired token",
        error: err.message,
      });
    }

    console.log("Verified user:", user);

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        userType: user.userType,
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Optional: Generate new refresh token (rotates the token)
    const newRefreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        userType: user.userType,
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};

// ===================== LOGOUT =====================
export const logout = (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

// ===================== AUTH MIDDLEWARE =====================
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1] || req.cookies?.accessToken;

  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Forgot Password - Single controller for OTP send, verify and reset
export const handleForgotPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, action } = req.body;

    // Validate required fields based on action
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists (Unified User Model)
    // We check for userType 'alumni' specifically if this is an alumni portal feature,
    // or generic if for all. Assuming generic for now or strictly alumni if called from alumni portal.
    // Let's make it work for any user who drives the forgotten password flow.
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email address",
      });
    }

    // Handle different actions
    switch (action) {
      case "send-otp":
        return await handleSendOTP(user, res);

      case "verify-reset":
        return await handleVerifyAndReset(user, otp, newPassword, res);

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid action. Use 'send-otp' or 'verify-reset'",
        });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Handle OTP sending
const handleSendOTP = async (user, res) => {
  try {
    // Generate OTP and set expiry (10 minutes)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP and expiry to user record
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP - Alumni Portal",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You have requested to reset your password. Use the OTP below to proceed:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <br>
          <p>Best regards,<br>Alumni Portal Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
      action: "otp-sent",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    throw error;
  }
};

// Handle OTP verification and password reset
const handleVerifyAndReset = async (user, otp, newPassword, res) => {
  try {
    // Validate required fields
    if (!otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "OTP and new password are required",
      });
    }

    // Check password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Verify OTP
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check if OTP has expired
    if (new Date() > user.resetPasswordOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP fields
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    await user.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Successful - Alumni Portal",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Successful</h2>
          <p>Hello ${user.name},</p>
          <p>Your password has been successfully reset.</p>
          <p>If you didn't make this change, please contact support immediately.</p>
          <br>
          <p>Best regards,<br>Alumni Portal Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      action: "password-reset",
    });
  } catch (error) {
    console.error("Verify and reset error:", error);
    throw error;
  }
};

// check if alumni email is registered and verified or not
export const checkAlumniEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if alumni exists with this email (Unified User Model)
    const user = await User.findOne({ email, userType: "alumni" });

    if (!user) {
      return res.status(404).json({
        success: false,
        isRegistered: false,
        message: "This email is not registered as an alumni",
      });
    }

    // Check if alumni is verified
    if (!user.isVerified) {
      return res.status(200).json({
        success: true,
        isRegistered: true,
        isVerified: false,
        message:
          "Email found but account is not verified. Please verify your account first.",
        data: {
          name: user.name,
          email: user.email,
        },
      });
    }

    return res.status(200).json({
      success: true,
      isRegistered: true,
      isVerified: true,
      message: "Email verified as registered alumni",
      data: {
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error("Check alumni email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Update this controller in your authController.js
export const updateExtraEmail = async (req, res) => {
  try {
    const { userId, extraEmail } = req.body;

    if (!userId || !extraEmail) {
      return res.status(400).json({
        success: false,
        message: "User ID and extra email are required"
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user already has extra email
    if (user.extraEmail) {
      return res.status(400).json({
        success: false,
        message: "Extra email already exists for this user",
        data: {
          hasExtraEmail: true,
          existingExtraEmail: user.extraEmail
        }
      });
    }

    // Check if extra email already exists for another user
    const existingUserWithExtraEmail = await User.findOne({
      extraEmail: extraEmail.trim().toLowerCase(),
      _id: { $ne: userId }
    });

    if (existingUserWithExtraEmail) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered as an extra email for another user"
      });
    }

    // Update extra email
    user.extraEmail = extraEmail.trim().toLowerCase();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Extra email saved successfully",
      data: {
        extraEmail: user.extraEmail,
        hasExtraEmail: true
      }
    });

  } catch (error) {
    console.error("Update extra email error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Add this new endpoint to check if user needs extra email
export const checkExtraEmailStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        needsExtraEmail: !user.extraEmail,
        hasExtraEmail: !!user.extraEmail,
        extraEmail: user.extraEmail || null,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error("Check extra email status error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ✅ Register Student Profile Controller
export const registerStudent = async (req, res) => {
  try {
    const { userId, branch, batch, location, extraEmail, phone, linkedin } = req.body;

    if (!userId || !branch || !batch || !location || !extraEmail || !phone) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // ✅ Validation: extraEmail must NOT be @mitsgwl.ac.in
    if (extraEmail.toLowerCase().endsWith("@mitsgwl.ac.in")) {
      return res.status(400).json({
        message: "Please provide a personal email address (not your institute ID)"
      });
    }

    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Check if phone number is already taken by another user
    const existingPhone = await User.findOne({
      phone,
      _id: { $ne: userId }
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number is already associated with another account."
      });
    }

    // ✅ Check if personal email is already taken by another user
    if (extraEmail) {
      const existingEmail = await User.findOne({
        extraEmail,
        _id: { $ne: userId }
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Personal email is already associated with another account."
        });
      }
    }

    // Update User model fields
    student.extraEmail = extraEmail;
    student.phone = phone;
    student.isProfileComplete = true; // Mark profile as complete
    await student.save();

    // Update or create user profile (Unified UserProfile)
    let profile = await UserProfile.findOne({ userId });
    if (!profile) {
      profile = new UserProfile({ userId });
    }

    profile.branch = branch;
    profile.batch = batch;
    profile.location = location;
    profile.linkedin = linkedin;

    // ✅ Generate standardized education details for MITS Gwalior
    // format batch: "2020-2024" or just "2024" (if just 2024, assume 4 year degree)
    let startYear, endYear;
    if (batch.includes("-")) {
      const parts = batch.split("-").map(Number);
      startYear = parts[0];
      endYear = parts[1];
    } else {
      endYear = parseInt(batch);
      startYear = endYear - 4;
    }

    profile.education = [
      {
        type: "Bachelor",
        stream: branch,
        institution: "Madhav Institute of Technology and Science (MITS), Gwalior",
        from: `${startYear}-08-01`,
        to: `${endYear}-05-30`,
        gpa: "7.5",
      }
    ];

    await profile.save();

    // ✅ Send welcome email (Now including personal email if provided)
    emailService.sendWelcomeEmail(student).catch((error) => {
      console.error("Failed to send welcome email after registration:", error);
    });

    // Generate final tokens
    const { accessToken, refreshToken } = generateTokens(student);

    return res.status(200).json({
      success: true,
      message: "Student registration completed successfully",
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        userType: student.userType,
        isProfileComplete: student.isProfileComplete,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Student registration error:", error);

    // ✅ Handle MongoDB duplicate key error (E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      let message = "A duplicate record already exists.";

      if (field === "phone") {
        message = "This phone number is already associated with another account.";
      } else if (field === "email") {
        message = "This email is already registered.";
      } else if (field === "extraEmail") {
        message = "This personal email is already associated with another account.";
      }

      return res.status(409).json({
        success: false,
        message
      });
    }

    return res.status(500).json({ message: "Server error", error: error.message });
  }
};