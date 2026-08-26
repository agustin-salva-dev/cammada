import { test, expect } from "@playwright/test";

test.describe("Página de Predicciones (/predicciones)", () => {
  test("debe cargar la página /predicciones correctamente con su título y estructura", async ({
    page,
  }) => {
    await page.goto("/predicciones");

    await expect(
      page.getByRole("heading", { name: "¿Quién ganará?" }),
    ).toBeVisible();

    const emptyState = page.locator("#predicciones-empty-state");
    const cardsPrediccion = page.locator("[id^=card-prediccion-]");

    const hasEmptyState = await emptyState.isVisible();
    const hasCards = (await cardsPrediccion.count()) > 0;

    expect(hasEmptyState || hasCards).toBeTruthy();
  });
});
