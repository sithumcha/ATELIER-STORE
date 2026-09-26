import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// GET /api/reviews - Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// GET /api/reviews/approved - Get only approved reviews for public storefront testimonials
router.get('/approved', async (req, res) => {
  try {
    const reviews = await Review.find({ $or: [{ approved: true }, { status: 'Approved' }] }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching approved reviews', error: error.message });
  }
});

// POST /api/reviews - Create a new review
router.post('/', async (req, res) => {
  try {
    const { productId, productTitle, userName, userLocation, rating, title, body, orderId, avatar } = req.body;
    
    if (!productId || !body) {
      return res.status(400).json({ message: 'Product ID and review body are required' });
    }

    const newReview = new Review({
      productId,
      productTitle: productTitle || 'Atelier Garment',
      userName: userName || 'Patron Collector',
      userLocation: userLocation || 'Kyoto / Global',
      rating: Number(rating) || 5,
      title: title || 'Patron Garment Evaluation',
      body,
      orderId: orderId || '',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      status: 'Pending',
      approved: false
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
});

// PUT /api/reviews/:id/approve - Approve review
router.put('/:id/approve', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = 'Approved';
    review.approved = true;
    const updated = await review.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error approving review', error: error.message });
  }
});

// PUT /api/reviews/:id/reject - Reject review
router.put('/:id/reject', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = 'Rejected';
    review.approved = false;
    const updated = await review.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting review', error: error.message });
  }
});

// DELETE /api/reviews/:id - Delete review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

export default router;
