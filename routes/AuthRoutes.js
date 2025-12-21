import express from "express";
import {
  register,
  login,
  googleAuth,
  googleCallback,
  googleAuthAlumni,
  googleCallbackAlumni,
  googleAuthAlumniRegister,
  googleCallbackAlumniRegister,
  refreshAccessToken,
  logout,
  registerAlumni,
  loginAlumni,
  adminLogin,
  handleForgotPassword,
  checkAlumniEmail,
  updateExtraEmail,
  checkExtraEmailStatus,
  registerStudent
} from "../controller/AuthController.js";

// Change this import - use default import instead of named import
import BulkRegisterAlumni from "../controller/bulkRegisterAlumni.js";
import { upload } from "../controller/bulkRegisterAlumni.js";

import authenticateToken from "../middlewares/authMiddleware.js";
const router = express.Router();

// ========== TRADITIONAL AUTH ROUTES ==========
router.post("/register", register);
router.post("/login", login);
router.post("/register-student", registerStudent);

// ====admin login =======
router.post("/admin-login", adminLogin);

// ========== GOOGLE OAUTH ROUTES ==========
router.get("/google", googleAuth);
router.get("/google/callback", (req, res, next) => {
  // Check the state parameter to determine the flow
  const state = req.query.state;

  if (state === "alumni") {
    return googleCallbackAlumni(req, res, next);
  } else if (state === "alumni-register") {
    return googleCallbackAlumniRegister(req, res, next);
  }
  // Default to student login
  return googleCallback(req, res, next);
});

// ========== GOOGLE OAUTH ROUTES FOR ALUMNI ==========
router.get("/google-alumni", googleAuthAlumni);
router.get("/google-alumni-register", googleAuthAlumniRegister);
// Alumni uses same callback as students, differentiated by state parameter

// ========== TOKEN MANAGEMENT ==========
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

// ========== EXAMPLE PROTECTED ROUTE ==========
router.get("/profile", authenticateToken, async (req, res) => {
  // req.user is available from authenticateToken middleware
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// ========== Alumni AUTH ROUTES ==========
router.post("/register-alumni", registerAlumni);
router.post("/bulk-register-alumni", upload.single("file"), BulkRegisterAlumni);
router.post("/login-alumni", loginAlumni);

router.post("/forgot-password", handleForgotPassword);
router.post("/check", checkAlumniEmail);

// Add this route
router.get("/check-extra-email-status/:userId", checkExtraEmailStatus);
router.post("/update-extra-email", updateExtraEmail);

export default router;
