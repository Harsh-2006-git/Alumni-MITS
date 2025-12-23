// controllers/messageController.js
import User from "../models/user.js";
import Message from "../models/Message.js";

export const getAllPeople = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Fetch all students and alumni except the current user
    const people = await User.find(
      {
        userType: { $in: ["student", "alumni"] },
        _id: { $ne: currentUserId }
      },
      "id name email phone userType"
    );

    return res.status(200).json({
      success: true,
      count: people.length,
      data: people,
    });
  } catch (error) {
    console.error("Error fetching people:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch people" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: senderId, userType: senderType } = req.user; // JWT
    const { receiverPhone, receiverType, text } = req.body;

    if (!receiverPhone || !receiverType || !text) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 Find receiver (Unified User Model)
    const receiver = await User.findOne({
      phone: receiverPhone,
      userType: receiverType
    });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // 🔹 Save message
    const message = await Message.create({
      senderId,
      senderType,
      receiverId: receiver.id,
      receiverType,
      text,
    });

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyMessages = async (req, res) => {
  try {
    const { id: userId, userType } = req.user;

    const messages = await Message.find({
      $or: [
        { senderId: userId, senderType: userType },
        { receiverId: userId, receiverType: userType },
      ],
    }).sort({ createdAt: 1 });

    const messagesWithUsers = await Promise.all(
      messages.map(async (msg) => {
        // Both sender and receiver are now in the User model
        const sender = await User.findById(
          msg.senderId,
          "id name userType phone email"
        );

        const receiver = await User.findById(
          msg.receiverId,
          "id name userType phone email"
        );

        return {
          id: msg._id,
          text: msg.text,
          createdAt: msg.createdAt,
          sender: sender ? sender.toJSON() : null,
          receiver: receiver ? receiver.toJSON() : null,
        };
      })
    );

    return res.status(200).json({ success: true, data: messagesWithUsers });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
