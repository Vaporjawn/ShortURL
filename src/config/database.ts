import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const connectDB = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urlShortener';

    await mongoose.connect(mongoURI);

    logger.info('MongoDB connected successfully');

    mongoose.connection.on('error', (err: Error) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
