import mongoose from 'mongoose';
import { ENV } from './env';

const connectDB = async (): Promise<void> => {
    const conn = await mongoose.connect(ENV.MONGO_URI as string);
    console.log(`MongoDB Connected : ${conn.connection.host}`);
};

export default connectDB;