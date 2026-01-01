import Notification from "../models/Notification.js";

// @desc    Create a new notification
// @route   POST /notification/create
// @access  Admin
export const createNotification = async (req, res) => {
    try {
        const { message, type } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        const notification = await Notification.create({
            message,
            type: type || "info",
        });

        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            data: notification,
        });
    } catch (error) {
        console.error("Error creating notification:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get all notifications
// @route   GET /notification/all
// @access  Public (Authenticated Users)
export const getAllNotifications = async (req, res) => {
    try {
        // Sort by newest first, limit to 20
        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
