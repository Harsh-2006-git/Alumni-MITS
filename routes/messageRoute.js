// routes/messageRoutes.js
import express from "express";
import {
  sendMessage,
  getMyMessages,
  getAllPeople,
} from "../controller/messageController.js";
import authenticateClient from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/send", authenticateClient, sendMessage);
router.get("/my", authenticateClient, getMyMessages);
router.get("/people", getAllPeople);

export default router;
