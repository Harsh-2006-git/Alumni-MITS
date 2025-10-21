import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js"; // User = Student
import Alumni from "../models/alumni.js";
import AlumniProfile from "../models/AlumniProfile.js";
import EmailService from "../services/NewUserEmailService.js"; // Add email service import
import csv from "csv-parser";
import multer from "multer";
import { Readable } from "stream";

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

        let user = await User.findOne({ where: { email } });
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

    const { accessToken, refreshToken } = generateTokens(user);

    const redirectUrl = new URL(`${FRONTEND_URL}/login`);
    redirectUrl.searchParams.set("accessToken", accessToken);
    redirectUrl.searchParams.set("refreshToken", refreshToken);
    redirectUrl.searchParams.set("name", encodeURIComponent(user.name));
    redirectUrl.searchParams.set("email", user.email);
    redirectUrl.searchParams.set("id", user.id.toString());
    redirectUrl.searchParams.set("userType", user.userType);

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

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(409).json({ message: "Email exists" });

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) return res.status(409).json({ message: "Phone exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      userType: "student",
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

    const user = await User.findOne({ where: { email } });
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

// ===================== REGISTER / LOGIN ALUMNI =====================
export const registerAlumni = async (req, res) => {
  try {
    const { name, email, phone, password, branch } = req.body;

    const existing = await Alumni.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const existingPhone = await Alumni.findOne({ where: { phone } });
    if (existingPhone)
      return res.status(400).json({ message: "Phone number already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const alumni = await Alumni.create({
      name,
      email,
      phone,
      password: hashedPassword,
      branch,
      userType: "alumni",
      isVerified: false, // Set to false initially
    });

    // ✅ Send welcome email to alumni (non-blocking)
    emailService.sendWelcomeEmail(alumni).catch((error) => {
      console.error("Failed to send welcome email to alumni:", error);
      // Don't fail the registration if email fails
    });

    // Remove token generation for registration
    res.status(201).json({
      message:
        "Alumni registered successfully. Your account is under verification.",
      user: {
        id: alumni.id,
        name: alumni.name,
        email: alumni.email,
        branch: alumni.branch,
        userType: alumni.userType,
        isVerified: alumni.isVerified,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Configure multer for file upload

export const loginAlumni = async (req, res) => {
  try {
    const { email, password } = req.body;
    const alumni = await Alumni.findOne({ where: { email } });

    if (!alumni) return res.status(404).json({ message: "User not found" });

    // Check verification
    if (!alumni.isVerified) {
      return res.status(403).json({
        message:
          "Your account is under verification. Please wait for approval.",
      });
    }

    const isMatch = await bcrypt.compare(password, alumni.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Generate Access Token (short life)
    const accessToken = jwt.sign(
      {
        id: alumni.id,
        email: alumni.email,
        name: alumni.name,
        phone: alumni.phone,
        userType: alumni.userType,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Generate Refresh Token (long life)
    const refreshToken = jwt.sign(
      {
        id: alumni.id,
        email: alumni.email,
        name: alumni.name,
        phone: alumni.phone,
        userType: alumni.userType,
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Option 1 (temporary): store in memory
    refreshTokens.push(refreshToken);

    // ✅ Option 2 (recommended): store in DB (uncomment if you add model)
    // await RefreshToken.create({ token: refreshToken, userId: alumni.id });

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
          id: alumni.id,
          name: alumni.name,
          email: alumni.email,
          userType: alumni.userType,
          isVerified: alumni.isVerified,
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
