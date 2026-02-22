import { randomBytes } from 'crypto';
import { prisma } from '../config/database';

export async function createProject(userId: string, name: string) {
    const apiKey = randomBytes(32).toString('hex');

    const project = await prisma.project.create({
        data: {
            name,
            apiKey,
            userId,
        },
    });

    return project;
}

export async function getProjectsByUser(userId: string) {
    return prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}

export async function validateApiKey(apiKey: string) {
    return prisma.project.findUnique({
        where: { apiKey },
    });
}
