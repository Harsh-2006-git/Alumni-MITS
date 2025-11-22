// models/Alumni.js

import mongoose from "mongoose";

const AlumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true, // keep same commented
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    recoveryEmail: {
      type: String,
      required: true,
      required: false,
      default: null,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: true,
      // unique: true,
      match: [/^[0-9+\-() ]+$/, "Invalid phone number"],
    },
    branch: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
      enum: ["student", "alumni"],
      default: "alumni",
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
    resetPasswordOTP: {
      type: String,
      default: null,
    },
    resetPasswordOTPExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alumni", AlumniSchema, "alumni");
