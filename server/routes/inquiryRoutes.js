// Inquiry API Routes
import express from 'express';
import Inquiry from '../models/Inquiry.js';

const router = express.Router();

// 1. All Inquiries laba ganeema (GET /api/inquiries)
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inquiries', error: error.message });
  }
});

// 2. Aluth Inquiry Message ekak ewima (POST /api/inquiries)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newInquiry = new Inquiry({
      name: name || 'Anonymous Patron',
      email,
      subject: subject || 'General Inquiry',
      message,
    });
    const saved = await newInquiry.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Failed to send inquiry message', error: error.message });
  }
});

export default router;
