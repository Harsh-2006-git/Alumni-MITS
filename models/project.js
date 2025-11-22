import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    shortDesc: {
      type: String,
      required: true,
    },

    detailedDesc: {
      type: String,
    },

    techStack: {
      type: Array,
      default: [],
    },

    category: {
      type: String,
    },

    lookingForContributors: {
      type: Boolean,
      default: true,
    },

    contributorsNeeded: {
      type: Number,
      default: 1,
    },

    roles: {
      type: Array, // example: ["Frontend", "Backend", "UI/UX"]
      default: [],
    },

    repoLink: {
      type: String,
    },

    contactLink: {
      type: String,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    tags: {
      type: Array,
      default: [],
    },

    thumbnail: {
      type: String,
    },

    guidelines: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    userType: {
      type: String,
      enum: ["student", "alumni", "admin"],
    },

    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // or "Alumni"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
