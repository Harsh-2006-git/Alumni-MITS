// models/Mentor.js
import mongoose from "mongoose";

const MentorSchema = new mongoose.Schema(
  {
    alumni_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9+\-() ]+$/,
    },
    batch_year: {
      type: Number,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    current_position: {
      type: String,
      default: null,
    },
    company: {
      type: String,
      default: null,
    },
    linkedin_url: {
      type: String,
      match: /^https?:\/\/.+/,
      default: null,
    },
    expertise: {
      type: String,
      default: null,
    },
    topics: {
      type: [String],
      default: [],
    },
    availability: {
      type: Object,
      default: {},
    },
    fees: {
      type: Number,
      default: 0.0,
    },

    available: {
      type: Boolean,
      default: true,
    },
    mentee_students: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Student",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

MentorSchema.virtual("alumni", {
  ref: "Alumni",
  localField: "alumni_id",
  foreignField: "_id",
  justOne: true,
});

MentorSchema.virtual("mentees", {
  ref: "MentorStudent",
  localField: "_id",
  foreignField: "mentor_id",
});

MentorSchema.set("toObject", { virtuals: true });
MentorSchema.set("toJSON", { virtuals: true });

const Mentor = mongoose.model("Mentor", MentorSchema);

export default Mentor;
