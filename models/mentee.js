// models/MentorStudent.js
import mongoose from "mongoose";

const MentorStudentSchema = new mongoose.Schema(
  {
    mentor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled", "rejected"],
      default: "pending",
    },
    request_date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    request_time: {
      type: String,
      default: Date.now,
      required: true,
    },
    session_date: {
      type: Date,
      default: null,
    },
    session_time: {
      type: String,
      default: null,
    },
    request_message: {
      type: String,
      default: null,
    },
    mentor_notes: {
      type: String,
      default: null,
    },
    payment_screenshot: {
      type: String,
      default: null,
    },
    payment_status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    meeting_link: {
      type: String,
      default: null,
    },
    reschedule_requested: {
      type: Boolean,
      default: false,
    },
    reschedule_message: {
      type: String,
      default: null,
    },
    reschedule_date: {
      type: Date,
      default: null,
    },
    reschedule_time: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// MentorStudentSchema.index({ mentor_id: 1, student_id: 1 }, { unique: true });
MentorStudentSchema.index({ mentor_id: 1, student_id: 1 });

const MentorStudent = mongoose.model("MentorStudent", MentorStudentSchema);

export default MentorStudent;
