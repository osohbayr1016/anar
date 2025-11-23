"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.error("MONGODB_URI is not defined in environment variables");
            process.exit(1);
        }
        const conn = await mongoose_1.default.connect(mongoURI, {
        // Remove deprecated options, use default settings
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`✅ Database: ${conn.connection.name}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`❌ MongoDB Connection Error: ${error.message}`);
        }
        else {
            console.error("❌ An unexpected error occurred");
        }
        process.exit(1);
    }
};
exports.default = connectDB;
