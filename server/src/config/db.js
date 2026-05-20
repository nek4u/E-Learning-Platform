import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inacademy';
  try {
    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
