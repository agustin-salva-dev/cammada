import { test, expect } from "@playwright/test";

test.describe("Página de Opiniones & Comunidad (/opiniones)", () => {
  test("debe cargar la página /opiniones correctamente con sus secciones principales", async ({
    page,
  }) => {
    await page.goto("/opiniones");

    await expect(
      page.getByRole("heading", { name: "Opiniones del Evento" }),
    ).toBeVisible();

    const btnOpinar = page.locator("#btn-hero-ir-a-opinar");
    await expect(btnOpinar).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Opiniones de la comunidad" }),
    ).toBeVisible();

    await expect(page.locator("#filtro-orden")).toBeVisible();
    await expect(page.locator("#filtro-categoria")).toBeVisible();
    await expect(page.locator("#filtro-estrellas")).toBeVisible();
  });

  test("debe navegar hacia /opinar al hacer click en el botón 'Dejar tu opinión'", async ({
    page,
  }) => {
    await page.goto("/opiniones");
    await page.locator("#btn-hero-ir-a-opinar").click();
    await expect(page).toHaveURL(/\/opinar$/);
  });
});

test.describe("Página para Opinar (/opinar)", () => {
  test("debe permitir abrir el modal para dejar comentario o sugerencia", async ({
    page,
  }) => {
    await page.goto("/opinar");

    const btnModal = page.locator("#btn-dejar-comentario-modal").first();
    await expect(btnModal).toBeVisible();
    await btnModal.click();
    await expect(
      page.getByRole("heading", { name: "Escribir opinión o sugerencia" }),
    ).toBeVisible();

    await page
      .locator("#opinion-titulo")
      .fill("Excelente infraestructura E2E Test");
    await page
      .locator("#opinion-descripcion")
      .fill(
        "Esta es una prueba automatizada para validar el envío correcto de sugerencias.",
      );

    await expect(page.locator("#btn-enviar-opinion")).toBeVisible();
  });
});
