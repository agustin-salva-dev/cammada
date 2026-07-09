import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Autenticación — usuario no autenticado", () => {
  test("redirige al login al acceder al dashboard sin sesión", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/admin/);
  });

  test("redirige al login al acceder a rutas de admin sin sesión", async ({
    page,
  }) => {
    await page.goto("/admin/register");
    await expect(page).toHaveURL(/\/admin/);
  });
});

test.describe("Autenticación — flujo de login", () => {
  test("muestra error con credenciales incorrectas", async ({ page }) => {
    await page.goto("/admin");

    await page.locator("#email").fill("usuario_inexistente@test.com");
    await page.locator("#password").fill("contraseñaIncorrecta1!");

    await page.getByRole("button", { name: /^ingresar$/i }).click();
    await expect(
      page.getByText(/credenciales|inválid|incorrecto/i),
    ).toBeVisible();
    await expect(page).not.toHaveURL(/\/dashboard/);
  });

  test("redirige al dashboard con credenciales correctas", async ({ page }) => {
    await page.goto("/admin");

    await page
      .locator("#email")
      .fill(process.env.TEST_USER_EMAIL!);
    await page
      .locator("#password")
      .fill(process.env.TEST_USER_PASSWORD!);

    await page.getByRole("button", { name: /^ingresar$/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
  });
});
