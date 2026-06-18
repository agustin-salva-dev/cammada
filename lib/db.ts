import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (typeof window === "undefined") {
  if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
  } else {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({ adapter });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaInstance;
    }
  }
} else {
  // Client-side fallback if imported on client (though it shouldn't be used directly there)
  prismaInstance = null as unknown as PrismaClient;
}

export const db = prismaInstance;
