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
      "name email phone userType"
    );

    const peopleWithId = people.map(p => ({
      ...p.toJSON(),
      id: p._id.toString()
    }));

    return res.status(200).json({
      success: true,
      count: peopleWithId.length,
      data: peopleWithId,
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
    const { id: userId } = req.user;

    // Use .populate() to get user details in a single query
    // Limit to 500 most recent messages to improve performance
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId", "name userType phone email")
      .populate("receiverId", "name userType phone email")
      .sort({ createdAt: 1 })
      .limit(500);

    const formattedMessages = messages.map((msg) => ({
      id: msg._id,
      text: msg.text,
      createdAt: msg.createdAt,
      sender: msg.senderId ? { ...msg.senderId.toJSON(), id: msg.senderId._id.toString() } : null,
      receiver: msg.receiverId ? { ...msg.receiverId.toJSON(), id: msg.receiverId._id.toString() } : null,
      isDeleted: msg.isDeleted,
      isEdited: msg.isEdited,
    }));

    return res.status(200).json({ success: true, data: formattedMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { peerId } = req.params;

    if (!peerId) {
      return res.status(400).json({ success: false, message: "Peer ID is required" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: peerId },
        { senderId: peerId, receiverId: userId },
      ],
    })
      .populate("senderId", "name userType phone email")
      .populate("receiverId", "name userType phone email")
      .sort({ createdAt: 1 });

    const formattedMessages = messages.map((msg) => ({
      id: msg._id,
      text: msg.text,
      createdAt: msg.createdAt,
      sender: msg.senderId ? { ...msg.senderId.toJSON(), id: msg.senderId._id.toString() } : null,
      receiver: msg.receiverId ? { ...msg.receiverId.toJSON(), id: msg.receiverId._id.toString() } : null,
      isDeleted: msg.isDeleted,
      isEdited: msg.isEdited,
    }));

    return res.status(200).json({ success: true, data: formattedMessages });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
