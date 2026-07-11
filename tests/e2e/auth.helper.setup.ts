import { test as setup, expect } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";
import { db } from "../../lib/db";
import { hash } from "bcryptjs";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env.test"), override: true });

const HELPER_AUTH_FILE = path.join(__dirname, ".auth/helper.json");

setup("autenticar usuario ayudante de prueba", async ({ page }) => {
  const helperEmail = process.env.TEST_HELPER_EMAIL || "ayudante@test.com";
  const helperPassword = process.env.TEST_HELPER_PASSWORD || "ayudante123!";
  const hashedHelperPassword = await hash(helperPassword, 10);

  if (db) {
    await db.usuario.upsert({
      where: { email: helperEmail },
      update: {
        password: hashedHelperPassword,
        rol: "AYUDANTE",
      },
      create: {
        email: helperEmail,
        nombre: "Ayudante de Pruebas",
        password: hashedHelperPassword,
        rol: "AYUDANTE",
      },
    });
  }

  await page.goto("/admin");

  await page.locator("#email").fill(helperEmail);
  await page.locator("#password").fill(helperPassword);

  await page.getByRole("button", { name: /^ingresar$/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  await page.context().storageState({ path: HELPER_AUTH_FILE });
});

