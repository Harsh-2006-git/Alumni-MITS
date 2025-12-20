// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    extraEmail: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid extra email format",
      },
    },
    phone: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
      enum: ["student", "alumni", "admin", "hod", "faculty"],
      required: true,
    },
    hasCompletedProfile: {
      type: Boolean,
      default: false,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    branch: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);