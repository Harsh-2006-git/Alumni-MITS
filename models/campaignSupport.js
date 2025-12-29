import mongoose from "mongoose";

const CampaignSupportSchema = new mongoose.Schema(
    {
        campaignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true,
        },
        supporterEmail: {
            type: String,
            required: true,
        },
        supporterName: {
            type: String,
            required: true,
        },
        supporterUserType: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
            min: 1,
        },
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ["pending", "verified", "rejected", "disputed"],
            default: "pending",
        },
        complaintText: {
            type: String,
            default: null,
        },
        verifiedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("CampaignSupport", CampaignSupportSchema);
