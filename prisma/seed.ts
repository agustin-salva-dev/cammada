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

  console.log("🌱 Seeding default admin user...");
  const email = process.env.TEST_USER_EMAIL || "user@test.com";
  const password = process.env.TEST_USER_PASSWORD || "testuser123!";
  
  const bcrypt = await import("bcryptjs");
  const hashedPassword = bcrypt.hashSync(password, 10);

  await prisma.usuario.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      rol: "SUPERADMIN",
    },
    create: {
      email,
      nombre: "Administrador de Pruebas",
      password: hashedPassword,
      rol: "SUPERADMIN",
    },
  });
  console.log(`  ✅ Admin user "${email}" seeded successfully`);

  console.log("🌱 Seeding default modalities...");
  const modalities = ["MMA", "Kickboxing", "Muay Thai"];
  for (const m of modalities) {
    await prisma.modalidad.upsert({
      where: { nombre: m },
      update: {},
      create: { nombre: m },
    });
  }
  console.log("  ✅ Modalities seeded successfully");

  console.log("🌱 Seeding default weight categories...");
  const categories = [
    { nombre: "Peso Mosca", orden: 1, limiteInferior: 52, limiteSuperior: 57 },
    { nombre: "Peso Gallo", orden: 2, limiteInferior: 57, limiteSuperior: 61 },
    { nombre: "Peso Pluma", orden: 3, limiteInferior: 61, limiteSuperior: 66 },
    { nombre: "Peso Ligero", orden: 4, limiteInferior: 66, limiteSuperior: 70 },
  ];
  for (const c of categories) {
    await prisma.categoriaPeso.upsert({
      where: { nombre: c.nombre },
      update: {
        orden: c.orden,
        limiteInferior: c.limiteInferior,
        limiteSuperior: c.limiteSuperior,
      },
      create: c,
    });
  }
  console.log("  ✅ Weight categories seeded successfully");

  console.log("🌱 Seeding complete!");

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
