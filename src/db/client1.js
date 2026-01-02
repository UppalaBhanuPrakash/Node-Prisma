// src/db/client1.js
const { PrismaClient } = require('@prisma/client1');

const prisma1 = new PrismaClient();

module.exports = prisma1;