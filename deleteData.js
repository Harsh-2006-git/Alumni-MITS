import mongoose from "mongoose";
import dotenv from "dotenv";
import CampaignSupport from "./models/campaignSupport.js";
import Campaign from "./models/campaign.js";

dotenv.config();

const deleteAllData = async () => {
    try {
        // 1. Connect to Database
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in .env file");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        // 2. Delete CampaignSupport Data
        console.log("WARNING: Deleting all documents from CampaignSupport...");
        const supportResult = await CampaignSupport.deleteMany({});
        console.log(`Successfully deleted ${supportResult.deletedCount} documents from CampaignSupport.`);

        // 3. Delete Campaign Data
        console.log("WARNING: Deleting all documents from Campaign...");
        const campaignResult = await Campaign.deleteMany({});
        console.log(`Successfully deleted ${campaignResult.deletedCount} documents from Campaign.`);

    } catch (error) {
        console.error("Error deleting data:", error);
    } finally {
        // 4. Close Connection
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
        process.exit();
    }
};

// Execute the function
deleteAllData();
