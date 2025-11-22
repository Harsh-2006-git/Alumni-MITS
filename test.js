// dropIndex.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dropIndex = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/alumni-mits");
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const result = await db.collection("jobs").dropIndex("sourceId_1");
    console.log("Index dropped successfully:", result);

    // List remaining indexes
    const indexes = await db.collection("jobs").getIndexes();
    console.log("Remaining indexes:", indexes);

    await mongoose.connection.close();
    console.log("Connection closed");
  } catch (error) {
    console.error("Error dropping index:", error);
  }
};

dropIndex();
