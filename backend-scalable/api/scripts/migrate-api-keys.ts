

import { createHash } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function createPrismaClient(): PrismaClient {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0]);
    return new PrismaClient({ adapter });
}

function hashApiKey(apiKey: string): string {
    return createHash('sha256').update(apiKey).digest('hex');
}

async function main() {
    const prisma = createPrismaClient();

    console.log('Starting API key migration (plain-text -> SHA-256)...');

    const projects = await prisma.project.findMany({
        select: { id: true, name: true, apiKey: true },
    });

    console.log(`Found ${projects.length} project(s) to migrate.`);

    let migrated = 0;
    let errors = 0;

    for (const project of projects) {
        try {
            const hashedKey = hashApiKey(project.apiKey);

            await prisma.project.update({
                where: { id: project.id },
                data: { apiKey: hashedKey },
            });

            console.log(`  [OK]   ${project.name} (${project.id})`);
            migrated++;
        } catch (err) {
            console.error(`  [ERR]  ${project.name} (${project.id}) — ${(err as Error).message}`);
            errors++;
        }
    }

    console.log('\n--- Migration Summary ---');
    console.log(`Migrated : ${migrated}`);
    console.log(`Errors   : ${errors}`);

    await prisma.$disconnect();

    if (errors > 0) {
        console.error('\nMigration completed with errors. Check logs above.');
        process.exit(1);
    } else {
        console.log('\nMigration completed successfully.');
    }
}

main().catch((err) => {
    console.error('Fatal error during migration:', err);
    process.exit(1);
});
