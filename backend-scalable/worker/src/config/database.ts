import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from './env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as { prisma: any };

function createPrismaClient(): PrismaClient {
    const pool = new Pool({
        connectionString: config.databaseUrl,
        max: 2,
    });
    const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0]);
    return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (config.nodeEnv !== 'production') {
    globalForPrisma.prisma = prisma;
}
