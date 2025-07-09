const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Prisma connected to PostgreSQL for Order service');
  } catch (err) {
    console.error('Prisma connection error:', err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = { prisma, connectDB };