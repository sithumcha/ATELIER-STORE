// Express Backend Main Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

import path from 'path';
import upload from './middleware/uploadMiddleware.js';

dotenv.config();

// MongoDB connect kireema
connectDB();

const app = express();

// Middlewares
const maxPayloadMB = process.env.MAX_FILE_SIZE_MB || '10';
app.use(cors());
app.use(express.json({ limit: `${maxPayloadMB}mb` }));

// Static uploads folder serve kireema
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check Endpoint
app.get('/', (req, res) => {
  res.send('🚀 E-Commerce Node.js Express API Server running cleanly!');
});

// Multer Image Upload Endpoint (POST /api/upload)
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
  res.status(200).json({
    message: 'Image uploaded successfully via Multer',
    imageUrl,
    filename: req.file.filename,
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/reviews', reviewRoutes);

// Server listen kireema
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 E-Commerce Express Backend API running on http://localhost:${PORT}`);
});
