

import { createHash } from 'crypto';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

function hashApiKey(apiKey: string): string {
    return createHash('sha256').update(apiKey).digest('hex');
}

function isAlreadyHashed(apiKey: string): boolean {

    return false;
}

async function main() {
    console.log('Starting API key migration (plain-text -> SHA-256)...');

    const projects = await prisma.project.findMany({
        select: { id: true, name: true, apiKey: true },
    });

    console.log(`Found ${projects.length} project(s) to migrate.`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const project of projects) {
        try {
            if (isAlreadyHashed(project.apiKey)) {
                console.log(`  [SKIP] ${project.name} (${project.id}) — already hashed`);
                skipped++;
                continue;
            }

            const hashedKey = hashApiKey(project.apiKey);

            await prisma.project.update({
                where: { id: project.id },
                data: { apiKey: hashedKey },
            });

            console.log(`  [OK]   ${project.name} (${project.id}) — migrated`);
            migrated++;
        } catch (err) {
            console.error(`  [ERR]  ${project.name} (${project.id}) — ${(err as Error).message}`);
            errors++;
        }
    }

    console.log('\n--- Migration Summary ---');
    console.log(`Migrated : ${migrated}`);
    console.log(`Skipped  : ${skipped}`);
    console.log(`Errors   : ${errors}`);

    if (errors > 0) {
        console.error('\nMigration completed with errors. Check logs above.');
        process.exit(1);
    } else {
        console.log('\nMigration completed successfully.');
    }
}

main()
    .catch((err) => {
        console.error('Fatal error during migration:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
