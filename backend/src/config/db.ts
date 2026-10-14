import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_assessment_db';
  try {
    await mongoose.connect(uri);
    console.log(`[Database] MongoDB connected successfully to ${uri}`);
  } catch (error) {
    console.error('[Database] MongoDB connection failure:', error);
    process.exit(1);
  }
}

