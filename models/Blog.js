import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        shortDescription: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        blogImage: {
            type: String, // Cloudinary URL or local path
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        authorEmail: {
            type: String,
            required: true,
        },
        authorPhoto: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Pending Approval", "Approved", "Rejected"],
            default: "Pending Approval",
        },
        publishedDate: {
            type: Date,
        },
        tags: [
            {
                type: String,
            },
        ],
        views: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Middleware to set publishedDate when status changes to Approved
BlogSchema.pre("save", function (next) {
    if (this.isModified("status") && this.status === "Approved" && !this.publishedDate) {
        this.publishedDate = new Date();
    }
    next();
});

export default mongoose.model("Blog", BlogSchema);
