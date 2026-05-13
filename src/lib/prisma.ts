import { PrismaClient } from "@prisma/client";

/**
 * Global Prisma type
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Create Prisma client
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

/**
 * Prevent multiple Prisma instances in development
 */
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}