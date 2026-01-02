// src/server.js
require('dotenv').config({ quiet: true });
const express = require('express');
const prisma1 = require('./db/client1');
const prisma2 = require('./db/client2');
const db1Routes = require('./routes/db1Routes');
const db2Routes = require('./routes/db2Routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/db1', db1Routes);
app.use('/api/db2', db2Routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Multi-Database API with Prisma',
    endpoints: {
      db1: {
        users: 'GET/POST /api/db1/users',
        posts: 'GET/POST /api/db1/posts'
      },
      db2: {
        products: 'GET/POST /api/db2/products',
        orders: 'GET/POST /api/db2/orders'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma1.$disconnect();
  await prisma2.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma1.$disconnect();
  await prisma2.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Database 1 (Users & Posts): Connected`);
  console.log(`Database 2 (Products & Orders): Connected`);
});