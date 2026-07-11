import { test, expect } from "@playwright/test";

test.describe("Ayudante — acceso de solo lectura al dashboard", () => {
  test("puede acceder al dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("puede ver el listado de luchadores", async ({ page }) => {
    await page.goto("/dashboard/luchadores");
    await expect(page).toHaveURL(/\/dashboard\/luchadores/);
    await expect(
      page.getByRole("heading", { name: /luchadores/i }),
    ).toBeVisible();
  });

  test("puede ver el listado de eventos", async ({ page }) => {
    await page.goto("/dashboard/eventos");
    await expect(page).toHaveURL(/\/dashboard\/eventos/);
    await expect(page.getByRole("heading", { name: /eventos/i })).toBeVisible();
  });
});

test.describe("Ayudante — botones de escritura no visibles", () => {
  test("NO ve botón para crear luchadores", async ({ page }) => {
    await page.goto("/dashboard/luchadores");
    await expect(
      page.getByRole("button", { name: /nuevo luchador|registrar/i }),
    ).not.toBeVisible();
  });

  test("NO ve botón para crear eventos", async ({ page }) => {
    await page.goto("/dashboard/eventos");
    await expect(
      page.getByRole("button", { name: /nuevo evento|crear evento/i }),
    ).not.toBeVisible();
  });

  test("NO ve botón para crear categorías de peso", async ({ page }) => {
    await page.goto("/dashboard/categorias-peso");
    await expect(
      page.getByRole("button", { name: /nueva categoría|agregar categoría/i }),
    ).not.toBeVisible();
  });

  test("NO ve botones de editar ni eliminar en la lista de luchadores", async ({
    page,
  }) => {
    await page.goto("/dashboard/luchadores");

    await expect(
      page.getByRole("button", { name: /editar|eliminar|borrar/i }).first(),
    ).not.toBeVisible();
  });
});

test.describe("Ayudante — rutas de administración denegadas o redirigidas", () => {
  test("al intentar ir a /dashboard/settings no ve opciones de gestión de cuentas", async ({
    page,
  }) => {
    await page.goto("/dashboard/settings");

    const pageContent = page.locator("body");
    await expect(pageContent).not.toContainText(/gestionar cuentas/i);
  });
});
