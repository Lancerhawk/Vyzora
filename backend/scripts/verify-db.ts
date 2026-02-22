import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    const count = await prisma.event.count();
    const events = await prisma.event.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
    });

    console.log(`Total Events: ${count}`);
    console.log('Last 5 Events:', JSON.stringify(events, null, 2));

    await prisma.$disconnect();
    await pool.end();
}

main().catch(console.error);
