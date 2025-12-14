import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    // Use local MongoDB connection string
    const mongoURI = "mongodb://localhost:27017/alumni-mits";

    const conn = await mongoose.connect(mongoURI);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
export default connectDB;
