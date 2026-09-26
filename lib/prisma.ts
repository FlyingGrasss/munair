import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

const pool = globalForPrisma.prismaPool ?? new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://unconfigured:unconfigured@127.0.0.1:5432/unconfigured",
  max: 4,
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 10_000,
});

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaPg(pool) });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPool = pool;
}

export { prisma };
