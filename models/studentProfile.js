// models/studentProfile.js
import mongoose from "mongoose";

const StudentProfile = mongoose.model(
  "StudentProfile",
  new mongoose.Schema(
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Student",
      },
      location: { type: String },
      branch: { type: String },
      batch: { type: String },
      about: { type: String },
      skills: { type: mongoose.Schema.Types.Mixed },
      achievements: { type: mongoose.Schema.Types.Mixed },
      linkedin: { type: String },
      github: { type: String },
      twitter: { type: String },
      portfolio: { type: String },
      education: { type: mongoose.Schema.Types.Mixed },
      profilePhoto: { type: String },
      resume: {
        type: String,
      },
      experience: {
        type: mongoose.Schema.Types.Mixed,
        // Example:
        // [
        //   { designation: "Software Engineer", company: "Google", from: "2020-01-01", to: "2022-06-30", current: false, location: "NY", description: "Worked on X" },
        //   { designation: "Senior Engineer", company: "Meta", from: "2022-07-01", to: null, current: true, location: "CA", description: "Leading Y project" }
        // ]
      },

    },
    {
      timestamps: true,
    }
  )
);

export default StudentProfile;
