import { test as setup, expect } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";
import { db } from "../../lib/db";
import { hash } from "bcryptjs";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env.test"), override: true });

const AUTH_FILE = path.join(__dirname, ".auth/user.json");

setup("autenticar usuario de prueba", async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL || "user@test.com";
  const password = process.env.TEST_USER_PASSWORD || "testuser123!";
  const hashedPassword = await hash(password, 10);

  if (db) {
    await db.usuario.upsert({
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
  }

  await page.goto("/admin");

  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);

  await page.getByRole("button", { name: /^ingresar$/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  await page.context().storageState({ path: AUTH_FILE });
});

