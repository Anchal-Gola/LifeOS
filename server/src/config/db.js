import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

const connectDB = async () => {
  try {
    console.log("⏳ Trying to connect to MongoDB...");
   

    await mongoose.connect(MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Database:", mongoose.connection.name);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;