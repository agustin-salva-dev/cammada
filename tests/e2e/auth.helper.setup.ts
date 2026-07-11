import { test as setup, expect } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });

const HELPER_AUTH_FILE = path.join(__dirname, ".auth/helper.json");

setup("autenticar usuario ayudante de prueba", async ({ page }) => {
  await page.goto("/admin");

  await page.locator("#email").fill(process.env.TEST_HELPER_EMAIL!);
  await page.locator("#password").fill(process.env.TEST_HELPER_PASSWORD!);

  await page.getByRole("button", { name: /^ingresar$/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  await page.context().storageState({ path: HELPER_AUTH_FILE });
});
