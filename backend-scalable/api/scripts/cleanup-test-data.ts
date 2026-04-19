import path from 'path';
import dotenv from 'dotenv';

// Load .env from the backend-scalable root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { prisma } from '../src/config/database';

async function main() {
    console.log('--- Vyzora Stress Test Cleanup ---');
    console.log('🔍 Searching for data tagged with { isStressTest: true }...');
    
    try {
        // Count first for safety
        const count = await prisma.event.count({
            where: {
                metadata: {
                    path: ['isStressTest'],
                    equals: true
                }
            }
        });

        if (count === 0) {
            console.log('✅ No stress test data found. Your database is clean!');
            return;
        }

        console.log(`⚠️  Found ${count} stress test events.`);
        
        // Use a small delay to give user a chance to cancel if they see a huge number
        console.log('🗑️  Deleting in 2 seconds... (Ctrl+C to cancel)');
        await new Promise(resolve => setTimeout(resolve, 2000));

        const result = await prisma.event.deleteMany({
            where: {
                metadata: {
                    path: ['isStressTest'],
                    equals: true
                }
            }
        });

        console.log(`✨ Successfully deleted ${result.count} test events.`);
        console.log('----------------------------------');
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
}

main()
    .catch((e) => {
        console.error('❌ Fatal error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
