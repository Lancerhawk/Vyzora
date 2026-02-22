import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { randomBytes } from 'crypto';
import 'dotenv/config';

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log('🌱 Seeding database...');

    const user = await prisma.user.upsert({
        where: { email: 'test@vyzora.com' },
        update: {},
        create: {
            email: 'test@vyzora.com',
            name: 'Test User',
            githubId: 'github_test_123',
        },
    });

    const apiKey = randomBytes(32).toString('hex');
    const project = await prisma.project.create({
        data: {
            name: 'Test Project',
            apiKey: apiKey,
            userId: user.id,
        },
    });

    console.log('✅ Seeded successfully!');
    console.log('---');
    console.log(`User ID: ${user.id}`);
    console.log(`Project ID: ${project.id}`);
    console.log(`API Key: ${apiKey}`);
    console.log('---');
    console.log('SAVE THIS API KEY FOR TESTING');

    await prisma.$disconnect();
    await pool.end();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
