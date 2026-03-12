import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from './env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as { prisma: any };

function createPrismaClient(): PrismaClient {
    // Limit pool size per instance to prevent 'MaxClients' errors when scaled.
    // 3 connections per replica * 3 replicas = 9 total connections.
    const pool = new Pool({
        connectionString: config.databaseUrl,
        max: 3,
    });
    const adapter = new PrismaPg(pool as any);
    return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (config.nodeEnv !== 'production') {
    globalForPrisma.prisma = prisma;
}
