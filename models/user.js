import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    recoveryEmail: {
      type: String,
      default: null,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    extraEmail: {
      type: String,
      default: null,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9+\-() ]+$/, "Invalid phone number"],
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["student", "alumni", "admin", "hod", "faculty"],
      required: true,
    },

    // Status Fields
    isVerified: {
      type: Boolean,
      default: false, // For Alumni/Faculty/Admin verification
    },
    isProfileComplete: {
      type: Boolean,
      default: false, // For Student profile completion check
    },

    // Common Profile/Asset Fields (Stored in User for quick access)
    profilePhoto: {
      type: String,
      default: null,
    },
    resume: {
      type: String,
      default: null,
    },

    // Common Academic/Alumni Fields (Useful for searching/filtering users without joining profile)
    branch: {
      type: String,
      default: null,
    },
    // For Alumni (e.g., "2020-2024") or Student batch
    batch: {
      type: String,
      default: null,
    },

    // Verification/Security
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

// Hash password before saving if modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", UserSchema);
