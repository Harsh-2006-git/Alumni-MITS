import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    campaignTitle: {
      type: String,
      required: true,
    },

    categories: {
      type: String,
      enum: [
        "startup",
        "research",
        "innovation",
        "infrastructure",
        "scholarship",
        "community",
        "other",
      ],
      required: true,
    },

    tagline: {
      type: String,
      default: null,
    },

    detailedDescription: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    currentAmount: {
      type: Number,
      default: 0,
      required: true,
    },

    projectLink: {
      type: String,
      default: null,
      match: [/^https?:\/\/.+/, "Invalid URL"],
    },

    github: {
      type: String,
      default: null,
      match: [/^https?:\/\/.+/, "Invalid URL"],
    },

    images: {
      type: Array,
      default: null,
    },

    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    contact: {
      type: String,
      required: true,
      match: [/^[0-9+\-() ]+$/, "Invalid phone"],
    },

    upiId: {
      type: String,
      required: true,
      match: [/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID"],
    },

    userType: {
      type: String,
      enum: ["student", "alumni", "college", "admin"],
      default: "alumni",
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
      required: true,
    },

    isCompleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "campaigns",
  }
);

export default mongoose.model("Campaign", CampaignSchema);
