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

// @desc    Delete a notification
// @route   DELETE /notification/:id
// @access  Admin
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        await notification.deleteOne();

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Edit a notification
// @route   PUT /notification/:id
// @access  Admin
export const editNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, type } = req.body;

        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.message = message || notification.message;
        notification.type = type || notification.type;

        const updatedNotification = await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification updated successfully",
            data: updatedNotification,
        });
    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

