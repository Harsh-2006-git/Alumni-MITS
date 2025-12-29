import express from "express";
import {
  saveAlumniProfile,
  getAlumniProfile,
  uploadProfilePhoto,
  upload,
  getStudentProfile,
  saveStudentProfile,
  uploadResume,
  analyzeSkillsMatch,
  getAllAlumni,
  getAllAlumni2,
  getUnverifiedAlumni,
  verifyAlumniStatus,
  getLinkedInProfileByUrl,
  deleteAlumni,
  getAllStudents,
} from "../controller/AlumniController.js";
import multer from "multer";
import authenticateAlumni from "../middlewares/authMiddleware.js";
import { optionalAuth } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/profile-alumni", authenticateAlumni, saveAlumniProfile);
router.get("/get-profile-alumni", authenticateAlumni, getAlumniProfile);
router.get("/get-profile-student", authenticateAlumni, getStudentProfile);
router.post("/profile-student", authenticateAlumni, saveStudentProfile);
// For fetching all alumni (e.g., admin or public)
router.get("/all-alumni", optionalAuth, getAllAlumni);
router.get("/all-students", optionalAuth, getAllStudents);
router.get("/all-alumni-admin", getAllAlumni2);
router.get("/all-nonvarified-alumni", getUnverifiedAlumni);
router.patch("/:id/verify", verifyAlumniStatus);
router.delete("/delete/:id", deleteAlumni);

const upload2 = multer({
  storage: multer.memoryStorage(), // Store files in memory as buffer
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

router.post(
  "/upload",
  authenticateAlumni,
  upload.single("profilePhoto"),
  uploadProfilePhoto
);
router.post(
  "/upload-resume",
  authenticateAlumni,
  upload2.single("resume"),
  uploadResume
);
router.post("/analyze", authenticateAlumni, analyzeSkillsMatch);

router.get("/profile", getLinkedInProfileByUrl);

export default router;
