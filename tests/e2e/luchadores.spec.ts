import { test, expect } from "@playwright/test";

/**
 * tests/e2e/luchadores.spec.ts
 *
 * Tests E2E del módulo de Luchadores.
 * Usa el storageState generado por auth.setup.ts (sesión pre-autenticada).
 */
test.describe("Luchadores — navegación y visualización", () => {
  test("navega correctamente a la sección de Luchadores", async ({ page }) => {
    await page.goto("/dashboard/luchadores");
    await expect(page).toHaveURL(/\/dashboard\/luchadores/);
    await expect(page.getByRole("heading", { name: /luchadores/i })).toBeVisible();
  });

  test("muestra la lista de luchadores", async ({ page }) => {
    await page.goto("/dashboard/luchadores");
    await expect(page.locator("table, [data-testid='luchadores-list']")).toBeVisible();
  });
});

test.describe("Luchadores — creación", () => {
  test("abre el formulario para registrar un luchador", async ({ page }) => {
    await page.goto("/dashboard/luchadores");
    await page.getByRole("button", { name: /nuevo luchador|registrar/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("muestra errores de validación al enviar formulario incompleto", async ({ page }) => {
    await page.goto("/dashboard/luchadores");
    await page.getByRole("button", { name: /nuevo luchador|registrar/i }).click();
    await page.getByRole("button", { name: /guardar|crear|confirmar/i }).click();

    // Debe mostrar mensajes de validación
    await expect(page.getByText(/obligatorio|requerido/i).first()).toBeVisible();
  });
});

test.describe("Luchadores — detalle y perfil", () => {
  test("navega al perfil de un luchador desde la lista", async ({ page }) => {
    await page.goto("/dashboard/luchadores");

    const primerLuchador = page.locator("table tbody tr, [data-testid='luchador-item']").first();
    const exists = await primerLuchador.count();

    if (exists > 0) {
      await primerLuchador.click();
      // El perfil debe mostrar información del luchador
      await expect(page.getByText(/récord|victorias|derrotas/i)).toBeVisible();
    } else {
      test.skip(true, "No hay luchadores registrados aún");
    }
  });
});
