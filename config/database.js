import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();

// const connectDB = async () => {
//   try {
//     // Use local MongoDB connection string
//     const mongoURI = "mongodb://localhost:27017/alumni-mits2";

//     const conn = await mongoose.connect(mongoURI);
//   } catch (error) {
//     console.error("❌ MongoDB connection failed:", error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;
