// models/Job.js
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      default: "full-time",
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      default: null,
    },
    experience: {
      type: String,
      default: null,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    closedDate: {
      type: Date,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
      enum: [
        "alumni",
        "Company",
        "admin",
        "auto",
        "Auto",
        "student",
        "Student",
      ],
      default: "alumni",
    },
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiredSkills: {
      type: Array,
      default: [],
    },
    qualifications: {
      type: Array,
      default: [],
    },
    companyWebsite: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
    source: {
      type: String,
      default: null,
    },
    sourceId: {
      type: String,
      sparse: true,
      default: null,
    },
    sourceUrl: {
      type: String,
      default: null,
    },
    isAutoPosted: {
      type: Boolean,
      default: false,
    },
    applyLink: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "closed", "expired", "expiring_soon"],
      default: "active",
    },
    lastChecked: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", JobSchema);

export default Job;
