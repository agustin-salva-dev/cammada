import { test as setup, expect } from "@playwright/test";
import path from "path";

const AUTH_FILE = path.join(__dirname, ".auth/user.json");

setup("autenticar usuario de prueba", async ({ page }) => {
  await page.goto("/admin");

  await page.locator("#email").fill(process.env.TEST_USER_EMAIL!);
  await page.locator("#password").fill(process.env.TEST_USER_PASSWORD!);

  await page.getByRole("button", { name: /^ingresar$/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  await page.context().storageState({ path: AUTH_FILE });
});
