// Database Connection Config
import mongoose from 'mongoose';

// MongoDB ekata connect wena function eka
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_db');
    console.log(`✅ MongoDB Connection Successful: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
