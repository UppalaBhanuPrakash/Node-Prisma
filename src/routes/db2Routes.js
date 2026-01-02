// src/routes/db2Routes.js
const express = require('express');
const router = express.Router();
const prisma2 = require('../db/client2');

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await prisma2.product.findMany({
      include: { orders: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const product = await prisma2.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma2.order.findMany({
      include: { product: true }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/orders', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Get product to calculate total
    const product = await prisma2.product.findUnique({
      where: { id: parseInt(productId) }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const total = product.price * parseInt(quantity);
    
    const order = await prisma2.order.create({
      data: {
        productId: parseInt(productId),
        quantity: parseInt(quantity),
        total
      }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;