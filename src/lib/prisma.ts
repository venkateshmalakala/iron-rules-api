import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Use 'as any' to bypass strict property checks for direct URL injection
    datasourceUrl: process.env.DATABASE_URL,
  } as any);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;