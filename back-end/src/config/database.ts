import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error("MONGODB_URI is not defined in environment variables");
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options, use default settings
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
    } else {
      console.error("❌ An unexpected error occurred");
    }
    process.exit(1);
  }
};

export default connectDB;
