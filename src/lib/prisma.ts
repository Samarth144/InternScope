import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    // Return a proxy that only throws when accessed
    return new Proxy({} as PrismaClient, {
      get: () => {
        throw new Error("Prisma accessed during build or without DATABASE_URL");
      },
    });
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
