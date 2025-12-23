// routes/mentorRoutes.js
import express from "express";
import {
  createMentor,
  editMentor,
  getMyMentorProfile,
  getAllMentors,
  canCreateMentor,
  requestMentorship,
  respondToMentorshipRequest,
  getMentorshipRequests,
  getStudentMentorships,
  updateMentorshipStatus,
  updateSessionDetails,
  getMentorMenteesForChat,
  checkRelationshipWithUser
} from "../controller/Mentor-mentee.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Check if user can create mentor profile
router.get("/can-create", authMiddleware, canCreateMentor);

// Create mentor profile (only for alumni)
router.post("/create", authMiddleware, createMentor);

// Edit mentor profile
router.put("/edit/:mentorId", authMiddleware, editMentor);

// Get current alumni's mentor profile
router.get("/my-profile", authMiddleware, getMyMentorProfile);

// Get all mentors (public route)
router.get("/all", getAllMentors);

// Student routes
router.post("/mentors/:mentorId/request", authMiddleware, requestMentorship);
router.get("/student/my-mentorships", authMiddleware, getStudentMentorships);
router.get("/student/mentorships", authMiddleware, getStudentMentorships);

// Mentor routes
router.get("/mentor/requests", authMiddleware, getMentorshipRequests);
router.put(
  "/requests/:requestId/respond",
  authMiddleware,
  respondToMentorshipRequest
);

// Common routes
router.put(
  "/mentorships/:requestId/status",
  authMiddleware,
  updateMentorshipStatus
);
router.put(
  "/mentorships/:requestId/session",
  authMiddleware,
  updateSessionDetails
);

// Get mentor (for students) or mentees (for alumni)
router.get('/mentor-mentees', authMiddleware, getMentorMenteesForChat);

// Check relationship with specific user by phone
router.get('/check-relationship/:targetPhone', authMiddleware, checkRelationshipWithUser);

export default router;
