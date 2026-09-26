import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productTitle: { type: String, required: true },
  userName: { type: String, required: true },
  userLocation: { type: String, default: 'Kyoto / Global' },
  rating: { type: Number, default: 5 },
  title: { type: String, default: 'Patron Garment Evaluation' },
  body: { type: String, required: true },
  verified: { type: Boolean, default: true },
  orderId: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  approved: { type: Boolean, default: false },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
