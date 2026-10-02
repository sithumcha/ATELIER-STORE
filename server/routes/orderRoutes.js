// Orders API Routes
import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail, sendTrackingUpdateEmail } from '../utils/emailService.js';

const router = express.Router();

// Helper: Deduct stock from Product database for ordered items
async function deductStockForOrder(items) {
  if (!Array.isArray(items) || items.length === 0) return;

  for (const item of items) {
    try {
      const qtyToDeduct = Number(item.qty || item.quantity) || 1;
      const rawTargetId = String(item.id || item._id || item.productId || '').trim();
      const cleanId = rawTargetId.replace(/[^0-9a-fA-F]/g, '');
      const targetTitle = (item.title || item.name || '').toLowerCase().trim();

      let product = null;

      // 1. Try finding product by cleaned 24-char MongoDB ObjectId
      if (cleanId && cleanId.length === 24) {
        product = await Product.findById(cleanId);
      }

      // 2. Try finding product by custom id string
      if (!product && rawTargetId) {
        product = await Product.findOne({
          $or: [{ id: rawTargetId }, { id: cleanId }]
        });
      }

      // 3. Try finding product by title match
      if (!product && targetTitle) {
        const cleanTitle = targetTitle.split('(')[0].trim();
        product = await Product.findOne({
          title: new RegExp('^' + cleanTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i')
        });
      }

      if (product) {
        // Deduct from overall stock
        const currentStock = Number(product.stock) || 0;
        product.stock = Math.max(0, currentStock - qtyToDeduct);

        // Deduct from specific size stock if size matches
        if (Array.isArray(product.sizes) && product.sizes.length > 0 && item.size) {
          const itemSizeStr = String(item.size).toLowerCase().trim();
          product.sizes = product.sizes.map((s) => {
            if (typeof s === 'object' && s !== null) {
              const szLabel = String(s.label || s.roman || s.code || '').toLowerCase().trim();
              if (szLabel === itemSizeStr || itemSizeStr.includes(szLabel) || szLabel.includes(itemSizeStr)) {
                const sStock = Number(s.stock) || 0;
                return { ...s, stock: Math.max(0, sStock - qtyToDeduct) };
              }
            }
            return s;
          });
        }

        await product.save();
        console.log(`[STOCK DEDUCTED] Product "${product.title}" (${product._id}): reduced by ${qtyToDeduct} (New Stock: ${product.stock})`);
      } else {
        console.warn(`[STOCK WARNING] Could not match product for item:`, item);
      }
    } catch (err) {
      console.error('Error deducting stock for order item:', err);
    }
  }
}

// Helper: Restore stock to Product database when order is deleted or cancelled
async function restoreStockForOrder(items) {
  if (!Array.isArray(items) || items.length === 0) return;

  for (const item of items) {
    try {
      const qtyToRestore = Number(item.qty || item.quantity) || 1;
      const rawTargetId = String(item.id || item._id || item.productId || '').trim();
      const cleanId = rawTargetId.replace(/[^0-9a-fA-F]/g, '');
      const targetTitle = (item.title || item.name || '').toLowerCase().trim();

      let product = null;

      if (cleanId && cleanId.length === 24) {
        product = await Product.findById(cleanId);
      }
      if (!product && rawTargetId) {
        product = await Product.findOne({
          $or: [{ id: rawTargetId }, { id: cleanId }]
        });
      }
      if (!product && targetTitle) {
        const cleanTitle = targetTitle.split('(')[0].trim();
        product = await Product.findOne({
          title: new RegExp('^' + cleanTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i')
        });
      }

      if (product) {
        const currentStock = Number(product.stock) || 0;
        product.stock = currentStock + qtyToRestore;

        if (Array.isArray(product.sizes) && product.sizes.length > 0 && item.size) {
          const itemSizeStr = String(item.size).toLowerCase().trim();
          product.sizes = product.sizes.map((s) => {
            if (typeof s === 'object' && s !== null) {
              const szLabel = String(s.label || s.roman || s.code || '').toLowerCase().trim();
              if (szLabel === itemSizeStr || itemSizeStr.includes(szLabel) || szLabel.includes(itemSizeStr)) {
                const sStock = Number(s.stock) || 0;
                return { ...s, stock: sStock + qtyToRestore };
              }
            }
            return s;
          });
        }

        await product.save();
        console.log(`[STOCK RESTORED] Product "${product.title}" (${product._id}): restored by ${qtyToRestore} (New Stock: ${product.stock})`);
      }
    } catch (err) {
      console.error('Error restoring stock for order item:', err);
    }
  }
}

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
    const { orderId, patronName, patronEmail, items, destination, total, status, trackingCode, trackingNumber, trackingNo } = req.body;

    const newOrder = new Order({
      orderId: orderId || `#KR-${Math.floor(10000 + Math.random() * 90000)}`,
      patronName: patronName || 'Clara Vanderbilt',
      patronEmail: patronEmail || 'patron@store.com',
      items: items || [],
      destination: destination || 'Global Destination',
      total: Number(total) || 0,
      status: status || 'Awaiting Dispatch',
      trackingCode: trackingCode || trackingNumber || trackingNo || '',
      trackingNumber: trackingCode || trackingNumber || trackingNo || '',
    });

    const savedOrder = await newOrder.save();

    // Automatically deduct stock for ordered items
    await deductStockForOrder(savedOrder.items);

    // Send automated Order Placement Confirmation & HTML Tax Invoice Email
    sendOrderConfirmationEmail(savedOrder).catch((e) => console.log('Order email background error:', e));

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Failed to place order', error: error.message });
  }
});

// 5. Order status & tracking info update kireema (PUT /api/orders/:id/status)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({
        $or: [{ orderId: id }, { id: id }]
      });
    }

    if (order) {
      const isNewTrackingAdded = req.body.trackingCode || req.body.trackingNumber || req.body.trackingNo;
      const isDispatched = req.body.status && (req.body.status.includes('Dispatched') || req.body.status.includes('Transit'));

      if (req.body.status) order.status = req.body.status;
      if (req.body.trackingCode !== undefined) order.trackingCode = req.body.trackingCode;
      if (req.body.trackingNumber !== undefined) order.trackingNumber = req.body.trackingNumber;
      if (req.body.trackingNo !== undefined) {
        order.trackingCode = req.body.trackingNo;
        order.trackingNumber = req.body.trackingNo;
      }

      const updatedOrder = await order.save();
      console.log(`[ORDER UPDATED] Order ${order._id} (${order.orderId}): Status=${order.status}, Tracking=${order.trackingCode}`);

      // Send automated Courier Tracking & Shipping Alert Email to patron
      if (isNewTrackingAdded || isDispatched) {
        sendTrackingUpdateEmail(updatedOrder, updatedOrder.trackingCode).catch((e) => console.log('Tracking update email error:', e));
      }

      return res.json(updatedOrder);
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order status/tracking:', error);
    return res.status(500).json({ message: 'Failed to update order status or tracking', error: error.message });
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
      // Automatically restore stock when order is deleted
      await restoreStockForOrder(deleted.items);
      res.json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
});

export default router;
