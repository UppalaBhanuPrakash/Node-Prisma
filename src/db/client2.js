// src/db/client2.js
const { PrismaClient } = require('@prisma/client2');

const prisma2 = new PrismaClient();

module.exports = prisma2;