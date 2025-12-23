import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        // Basic Info
        location: { type: String, default: null },
        about: { type: String, default: null },

        // Academic Info (Redundant with User but detailed here if needed)
        branch: { type: String, default: null },
        batch: { type: String, default: null },

        // Professional / Skills
        skills: { type: Array, default: [] }, // Array of strings or objects
        achievements: { type: Array, default: [] },

        // Social Links
        linkedin: { type: String, default: null },
        github: { type: String, default: null },
        twitter: { type: String, default: null },
        portfolio: { type: String, default: null },

        // Detailed Records
        education: {
            type: Array, // Array of education objects
            default: [],
        },
        experience: {
            type: Array, // Array of experience objects
            default: [],
        },
    },
    {
        timestamps: true,
        collection: "user_profiles",
    }
);

// Virtual populate to get user details
UserProfileSchema.virtual("user", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true,
});

export default mongoose.model("UserProfile", UserProfileSchema);
