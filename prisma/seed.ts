import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { DEFAULT_ROLE_PERMISSIONS, SYSTEM_ROLES } from "../constants/permissions";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("🌱 Seeding roles...");

  for (const roleName of SYSTEM_ROLES) {
    const permissions = DEFAULT_ROLE_PERMISSIONS[roleName] ?? [];

    await prisma.rolConfig.upsert({
      where: { nombre: roleName },
      update: { permisos: permissions },
      create: {
        nombre: roleName,
        permisos: permissions,
        isSystem: true,
      },
    });

    console.log(`  ✅ Role "${roleName}" seeded with ${permissions.length} permissions`);
  }

  console.log("🌱 Seeding complete!");

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
