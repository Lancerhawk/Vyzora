

const globalForPrisma = globalThis as unknown as {
    prisma: any;
};

function createPrismaClient(): any {
    const { PrismaClient } = require('@prisma/client');
    return new PrismaClient({
        log:
            process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error'],
    });
}

export const prisma: any = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
