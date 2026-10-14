"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_assessment_db';
    try {
        await mongoose_1.default.connect(uri);
        console.log(`[Database] MongoDB connected successfully to ${uri}`);
    }
    catch (error) {
        console.error('[Database] MongoDB connection failure:', error);
        process.exit(1);
    }
}
