import express from "express";
import {
  register,
  login,
  googleAuth,
  googleCallback,
  refreshAccessToken,
  logout,
  registerAlumni,
  loginAlumni,
  adminLogin,
  checkAlumniEmail,
  handleForgotPassword,
} from "../controller/AuthController.js";

// Change this import - use default import instead of named import
import BulkRegisterAlumni from "../controller/bulkRegisterAlumni.js";
import { upload } from "../controller/bulkRegisterAlumni.js";

import authenticateToken from "../middlewares/authMiddleware.js";
const router = express.Router();

// ========== TRADITIONAL AUTH ROUTES ==========
router.post("/register", register);
router.post("/login", login);

// ====admin login =======
router.post("/admin-login", adminLogin);

// ========== GOOGLE OAUTH ROUTES ==========
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

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

export default router;
