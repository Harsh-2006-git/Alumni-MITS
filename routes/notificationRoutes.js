import express from "express";
import {
    createNotification,
    getAllNotifications,
    deleteNotification,
    editNotification
} from "../controller/NotificationController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a notification (Admin only ideally, but using protect for now)
router.post("/create", protect, createNotification);

// Route to get all notifications (Authenticated users)
router.get("/all", protect, getAllNotifications);

// Route to delete a notification
router.delete("/:id", protect, deleteNotification);

// Route to edit a notification
router.put("/:id", protect, editNotification);

export default router;
