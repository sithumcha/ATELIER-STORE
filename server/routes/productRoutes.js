// Products API Routes
import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// 1. All Products laba ganeema (GET /api/products)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// 2. Single Product wisthara laba ganeema (GET /api/products/:id)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ id: id });
    }
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product details', error: error.message });
  }
});

// 3. Aluth Product ekak ekathu kireema (POST /api/products)
router.post('/', async (req, res) => {
  try {
    const rawPrice = req.body.price;
    const numericPrice = typeof rawPrice === 'number' 
      ? rawPrice 
      : (rawPrice !== undefined && rawPrice !== null ? (parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 0) : 0);

    const productData = {
      ...req.body,
      price: numericPrice,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : 50,
    };

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
});

// Bulk offer endpoints (MUST be defined before /:id)
// Apply offer to ALL products at once
router.post('/offer/bulk', async (req, res) => {
  try {
    const { offerPercentage, durationHours, offerTitle } = req.body;
    const pct = Number(offerPercentage) || 0;
    const hours = Number(durationHours) || 0;

    const offerExpiresAt = pct > 0 && hours > 0
      ? new Date(Date.now() + hours * 60 * 60 * 1000)
      : null;
    const title = offerTitle || (pct > 0 ? `${pct}% OFF Global Store Offer` : '');

    const result = await Product.updateMany(
      {},
      {
        $set: {
          offerPercentage: pct,
          offerExpiresAt: offerExpiresAt,
          offerTitle: title,
        },
      }
    );
    res.json({ message: 'Bulk offer applied to all products successfully', result, offerPercentage: pct, offerExpiresAt, offerTitle: title });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply bulk offer', error: error.message });
  }
});

// Remove offer from ALL products at once
router.delete('/offer/bulk', async (req, res) => {
  try {
    const result = await Product.updateMany(
      {},
      {
        $set: {
          offerPercentage: 0,
          offerExpiresAt: null,
          offerTitle: '',
        },
      }
    );
    res.json({ message: 'All product offers cleared successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear product offers', error: error.message });
  }
});

// 4. Product wisthara update kireema (PUT /api/products/:id)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ id: id });
    }
    if (product) {
      if (req.body.price !== undefined) {
        req.body.price = typeof req.body.price === 'number'
          ? req.body.price
          : parseFloat(String(req.body.price).replace(/[^0-9.]/g, '')) || product.price;
      }
      if (req.body.stock !== undefined) {
        req.body.stock = Number(req.body.stock);
      }

      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product to update not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});


// Apply/update offer for a single product
router.put('/:id/offer', async (req, res) => {
  try {
    const { id } = req.params;
    const { offerPercentage, durationHours, offerTitle } = req.body;

    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ id: id });
    }

    if (product) {
      const pct = Number(offerPercentage) || 0;
      const hours = Number(durationHours) || 0;

      product.offerPercentage = pct;
      product.offerTitle = offerTitle || (pct > 0 ? `${pct}% OFF Offer` : '');
      product.offerExpiresAt = pct > 0 && hours > 0
        ? new Date(Date.now() + hours * 60 * 60 * 1000)
        : null;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item offer', error: error.message });
  }
});

// Remove offer from a single product
router.delete('/:id/offer', async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ id: id });
    }

    if (product) {
      product.offerPercentage = 0;
      product.offerExpiresAt = null;
      product.offerTitle = '';
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item offer', error: error.message });
  }
});

// 5. Product ekak ain kireema (DELETE /api/products/:id)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Product.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await Product.findOneAndDelete({ id: id });
    }
    if (deleted) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product to delete not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

export default router;
