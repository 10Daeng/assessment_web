import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { logger } from '../utils/logger';

// Required for Node.js environments (non-edge) — Neon needs WebSocket
neonConfig.webSocketConstructor = ws;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set!');
  }

  logger.log('[Prisma] Creating client (connection configured via DATABASE_URL)');

  // Create connection pool with optimized settings
  const pool = new Pool({
    connectionString,
    max: 20, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 10000, // Timeout for establishing connection
  });

  const adapter = new PrismaNeon(pool);

  // Add connection pool monitoring
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  // Graceful shutdown handler
  process.on('beforeExit', async () => {
    logger.log('[Prisma] Closing connection pool...');
    await pool.end();
  });

  return client;
}

const globalForPrisma = globalThis;

// Initialize Prisma singleton for better connection management
export function getPrisma() {
  if (!globalForPrisma.__prisma) {
    globalForPrisma.__prisma = createPrismaClient();
  }
  return globalForPrisma.__prisma;
}

export default getPrisma();
