import { test, expect } from "@playwright/test";

test.describe("Rankings — navegación y visualización", () => {
  test("navega correctamente a la sección de Rankings", async ({ page }) => {
    await page.goto("/dashboard/rankings");
    await expect(page).toHaveURL(/\/dashboard\/rankings/);
    await expect(
      page.getByRole("heading", { name: "Rankings", exact: true }),
    ).toBeVisible();
  });

  test("muestra la lista de rankings o el estado vacío", async ({ page }) => {
    await page.goto("/dashboard/rankings");
    await expect(
      page.locator(".grid .rounded-xl, [class*='border-dashed']").first(),
    ).toBeVisible();
  });
});

test.describe("Rankings — creación", () => {
  test("abre el formulario de creación de ranking", async ({ page }) => {
    await page.goto("/dashboard/rankings");
    await page
      .getByRole("button", { name: /nuevo ranking|crear ranking/i })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});

test.describe("Rankings — edición de posiciones", () => {
  test("navega al detalle de un ranking y muestra los items", async ({
    page,
  }) => {
    await page.goto("/dashboard/rankings");
    const cards = page.locator(".grid .rounded-xl");
    let hasRankings = (await cards.count()) > 0;
    if (!hasRankings) {
      await page
        .getByRole("button", { name: /nuevo ranking|crear ranking/i })
        .first()
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      const selectModalidad = page.locator("select[id*='modalidad']");
      await selectModalidad.selectOption({ index: 1 });
      await page
        .getByRole("button", { name: /crear ranking|guardar/i })
        .click();
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect(cards.first()).toBeVisible();
      hasRankings = true;
    }
    const primerRanking = cards.first();
    await primerRanking.click();

    await expect(
      page
        .getByRole("heading", { name: /posiciones/i })
        .or(page.getByText(/posición|#1|campeón/i).first()),
    ).toBeVisible();
  });
});
