// Order Database Model
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    patronName: { type: String, required: true },
    patronEmail: { type: String, required: true },
    items: [
      {
        id: { type: String },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, default: 1 },
      },
    ],
    destination: { type: String, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: 'Awaiting Dispatch' },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
