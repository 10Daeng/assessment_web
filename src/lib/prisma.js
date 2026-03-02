import { PrismaClient } from '../generated/prisma/client';
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

  logger.log('[Prisma] Creating client with URL:', connectionString.substring(0, 40) + '...');

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis;

if (!globalForPrisma.__prisma) {
  globalForPrisma.__prisma = null;
}

export function getPrisma() {
  if (!globalForPrisma.__prisma) {
    globalForPrisma.__prisma = createPrismaClient();
  }
  return globalForPrisma.__prisma;
}

export default getPrisma();
