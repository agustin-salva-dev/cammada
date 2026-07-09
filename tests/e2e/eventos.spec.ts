import { test, expect } from "@playwright/test";

test.describe("Eventos — navegación y visualización", () => {
  test("navega correctamente a la sección de Eventos", async ({ page }) => {
    await page.goto("/dashboard/eventos");
    await expect(page).toHaveURL(/\/dashboard\/eventos/);
    await expect(page.getByRole("heading", { name: /eventos/i })).toBeVisible();
  });

  test("muestra la lista de eventos o el estado vacío", async ({ page }) => {
    await page.goto("/dashboard/eventos");
    await expect(
      page.locator(".grid .rounded-xl, [class*='border-dashed']").first(),
    ).toBeVisible();
  });
});

test.describe("Eventos — creación", () => {
  test("abre el formulario de creación de evento", async ({ page }) => {
    await page.goto("/dashboard/eventos");
    await page
      .getByRole("button", { name: /nuevo evento|crear evento/i })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("muestra errores de validación al enviar formulario vacío", async ({
    page,
  }) => {
    await page.goto("/dashboard/eventos");
    await page
      .getByRole("button", { name: /nuevo evento|crear evento/i })
      .click();

    await page
      .getByRole("button", { name: /guardar|crear|confirmar/i })
      .click();

    await expect(
      page.getByText(/obligatorio|requerido/i).first(),
    ).toBeVisible();
  });
});
