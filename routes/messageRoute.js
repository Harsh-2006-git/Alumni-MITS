// routes/messageRoutes.js
import express from "express";
import {
  sendMessage,
  getMyMessages,
  getAllPeople,
  getConversation,
} from "../controller/messageController.js";
import authenticateClient from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/send", authenticateClient, sendMessage);
router.get("/my", authenticateClient, getMyMessages);
router.get("/people", authenticateClient, getAllPeople);
router.get("/conversation/:peerId", authenticateClient, getConversation);

export default router;
