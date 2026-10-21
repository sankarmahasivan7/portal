import mongoose from 'mongoose';
import dns from 'dns';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_assessment_db';

  // Fix Node.js SRV DNS resolution on Windows for mongodb+srv://
  if (uri.startsWith('mongodb+srv://')) {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (e: any) {
      console.warn('[Database] DNS setServers warning:', e.message);
    }
  }

  try {
    await mongoose.connect(uri);
    const maskedUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log(`[Database] MongoDB connected successfully to ${maskedUri}`);
  } catch (error) {
    console.error('[Database] MongoDB connection failure:', error);
    process.exit(1);
  }
}
