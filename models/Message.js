// models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    senderType: {
      type: String,
      enum: ["student", "alumni"],
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverType: {
      type: String,
      enum: ["student", "alumni"],
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxlength: 500,
      required: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    resume: {
      type: String,
      default: null,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "messages",
    timestamps: false,
  }
);

// Indexes for faster conversation lookups
MessageSchema.index({ senderId: 1, receiverId: 1 });
MessageSchema.index({ receiverId: 1, senderId: 1 });

const Message = mongoose.model("Message", MessageSchema);

export default Message;
