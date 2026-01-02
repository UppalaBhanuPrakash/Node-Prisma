// src/routes/db1Routes.js
const express = require('express');
const router = express.Router();
const prisma1 = require('../db/client1');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await prisma1.user.findMany({
      include: { posts: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
router.post('/users', async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma1.user.create({
      data: { email, name }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await prisma1.post.findMany({
      include: { author: true }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
router.post('/posts', async (req, res) => {
  try {
    const { title, content, authorId, published } = req.body;
    const post = await prisma1.post.create({
      data: {
        title,
        content,
        published: published || false,
        authorId: parseInt(authorId)
      }
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;