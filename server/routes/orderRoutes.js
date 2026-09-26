// Orders API Routes
import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// 1. All Orders laba ganeema (GET /api/orders)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// 2. Patron Email ekata adala Orders laba ganeema (GET /api/orders/user/:email)
router.get('/user/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const orders = await Order.find({
      patronEmail: new RegExp('^' + email + '$', 'i')
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user orders', error: error.message });
  }
});

// 3. Single Order wisthara laba ganeema (GET /api/orders/:id)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let order = await Order.findOne({ orderId: id });
    if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order details', error: error.message });
  }
});

// 4. Aluth Order ekak daaneema (POST /api/orders)
router.post('/', async (req, res) => {
  try {
    const { orderId, patronName, patronEmail, items, destination, total, status } = req.body;

    const newOrder = new Order({
      orderId: orderId || `#KR-${Math.floor(10000 + Math.random() * 90000)}`,
      patronName: patronName || 'Clara Vanderbilt',
      patronEmail: patronEmail || 'patron@store.com',
      items: items || [],
      destination: destination || 'Global Destination',
      total: Number(total) || 0,
      status: status || 'Awaiting Dispatch',
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Failed to place order', error: error.message });
  }
});

// 5. Order status eka update kireema (PUT /api/orders/:id/status)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    let order = await Order.findOne({ orderId: id });
    if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

// 6. Order ekak ain kireema (DELETE /api/orders/:id)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = await Order.findOneAndDelete({ orderId: id });
    if (!deleted && id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Order.findByIdAndDelete(id);
    }
    if (deleted) {
      res.json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
});

export default router;
