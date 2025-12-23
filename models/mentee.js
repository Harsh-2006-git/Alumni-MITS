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
      enum: ["pending", "active", "completed", "cancelled"],
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
  },
  {
    timestamps: true,
  }
);

MentorStudentSchema.index({ mentor_id: 1, student_id: 1 }, { unique: true });

const MentorStudent = mongoose.model("MentorStudent", MentorStudentSchema);

export default MentorStudent;
