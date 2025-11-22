import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
      },
    },

    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v);
        },
      },
    },

    password: {
      type: String,
      required: true,
    },

    userType: {
      type: String,
      enum: ["student", "alumni"],
      default: "student",
      required: true,
    },

    profilePhoto: {
      type: String,
    },

    resume: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.index({ email: 1 }, { unique: true });
studentSchema.index({ phone: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);

export default Student;
