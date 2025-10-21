// controllers/peopleController.js
import Student from "../models/user.js";
import Alumni from "../models/alumni.js";

export const getAllPeople = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: ["id", "name", "email", "phone", "userType"],
    });
    const alumni = await Alumni.findAll({
      attributes: ["id", "name", "email", "phone", "userType"],
    });

    const combined = [
      ...students.map((s) => s.toJSON()),
      ...alumni.map((a) => a.toJSON()),
    ];

    return res.status(200).json({
      success: true,
      count: combined.length,
      data: combined,
    });
  } catch (error) {
    console.error("Error fetching people:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch people" });
  }
};

import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { id: senderId, userType: senderType } = req.user; // JWT
    const { receiverPhone, receiverType, text } = req.body;

    if (!receiverPhone || !receiverType || !text) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 Find receiver
    const receiverModel = receiverType === "student" ? Student : Alumni;
    const receiver = await receiverModel.findOne({
      where: { phone: receiverPhone },
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
import { Op } from "sequelize";

export const getMyMessages = async (req, res) => {
  try {
    const { id: userId, userType } = req.user;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, senderType: userType },
          { receiverId: userId, receiverType: userType },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    const messagesWithUsers = await Promise.all(
      messages.map(async (msg) => {
        const senderModel = msg.senderType === "student" ? Student : Alumni;
        const receiverModel = msg.receiverType === "student" ? Student : Alumni;

        const sender = await senderModel.findByPk(msg.senderId, {
          attributes: ["id", "name", "userType", "phone", "email"],
        });

        const receiver = await receiverModel.findByPk(msg.receiverId, {
          attributes: ["id", "name", "userType", "phone", "email"],
        });

        return {
          id: msg.id,
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
