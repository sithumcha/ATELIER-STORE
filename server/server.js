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
import cloudinary from './config/cloudinary.js';

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
  res.send('🚀 E-Commerce Node.js Express API Server running cleanly with Cloudinary!');
});

// Direct Cloudinary Memory Stream Upload Endpoint (POST /api/upload - NO local disk files)
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'atelier_products',
      resource_type: 'auto',
    },
    (error, result) => {
      if (error) {
        console.error('❌ Cloudinary Upload Error:', error);
        return res.status(500).json({ message: 'Cloudinary upload failed', error: error.message });
      }

      console.log(`✅ Cloudinary Direct Stream Upload Successful: ${result.secure_url}`);

      res.status(200).json({
        message: 'Image uploaded directly to Cloudinary (No local disk file created)',
        imageUrl: result.secure_url,
        public_id: result.public_id,
        cloud: true,
      });
    }
  );

  uploadStream.end(req.file.buffer);
});

// Direct Base64 / URL Cloudinary Upload Endpoint (POST /api/upload/cloudinary)
app.post('/api/upload/cloudinary', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: 'atelier_products',
    });

    res.status(200).json({
      message: 'Base64 image uploaded successfully to Cloudinary',
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Cloudinary base64 upload failed', error: err.message });
  }
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
