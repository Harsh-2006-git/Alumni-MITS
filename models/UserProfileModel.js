// models/UserProfileModel.js

import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
  {
    // Replacing INTEGER with MongoDB ObjectId reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: { type: String, default: null },
    branch: { type: String, default: null },
    about: { type: String, default: null },

    // Same JSON structure
    skills: { type: Array, default: null }, // ["JavaScript", "Node.js"]
    achievements: { type: Array, default: null }, // ["Won Hackathon 2024", "Published Paper"]

    linkedin: { type: String, default: null },
    github: { type: String, default: null },
    twitter: { type: String, default: null },
    portfolio: { type: String, default: null },

    batch: {
      type: String,
      default: null,
      // Example: "2024-2028"
    },

    // Multiple education entries
    education: {
      type: Array,
      default: null,
      // Example:
      // [
      //   { type: "Bachelor", stream: "CS", institution: "MIT", from: "2015-08-01", to: "2019-05-30", gpa: "9.2" },
      //   { type: "Master", stream: "AI", institution: "Stanford", from: "2020-08-01", to: "2022-05-30", gpa: "9.5" }
      // ]
    },

    // Multiple experience entries
    experience: {
      type: Array,
      default: null,
      // Example:
      // [
      //   { designation: "Software Engineer", company: "Google", from: "2020-01-01", to: "2022-06-30", current: false, location: "NY", description: "Worked on X" },
      //   { designation: "Senior Engineer", company: "Meta", from: "2022-07-01", to: null, current: true, location: "CA", description: "Leading Y project" }
      // ]
    },

    // Profile files
    profilePhoto: {
      type: String,
      default: null,
    },
    resume: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "user_profiles",
  }
);

// Associations (Mongo version of belongsTo / hasOne)
UserProfileSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

export default mongoose.model("UserProfile", UserProfileSchema);