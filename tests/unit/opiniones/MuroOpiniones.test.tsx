import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MuroOpiniones } from "@/features/opiniones/components/display/MuroOpiniones";
import type { OpinionPublica } from "@/features/opiniones/types";

const mockOpiniones: OpinionPublica[] = [
  {
    id: "1",
    nombreUsuario: "Carlos",
    rolParticipante: "ATLETA",
    tipo: "COMENTARIO",
    titulo: "Excelente torneo",
    descripcion: "La organización de los combates estuvo perfecta.",
    categoria: "ORGANIZACION",
    estrellas: 5,
    conteoVotos: 0,
    respuesta: null,
    createdAt: new Date("2026-08-10T10:00:00Z"),
  },
  {
    id: "2",
    nombreUsuario: "María",
    rolParticipante: "ESPECTADOR",
    tipo: "SUGERENCIA",
    titulo: "Más pantallas gigantes",
    descripcion: "Estaría bueno ver las repeticiones en pantalla gigante.",
    categoria: "LUGAR_INSTALACIONES",
    estrellas: 4,
    conteoVotos: 12,
    respuesta: null,
    createdAt: new Date("2026-08-11T12:00:00Z"),
  },
];

vi.mock("@/features/opiniones/actions", () => ({
  votarSugerencia: vi.fn().mockResolvedValue({ success: true }),
  submitOpinion: vi.fn().mockResolvedValue({ success: true }),
}));

describe("MuroOpiniones Component", () => {
  it("debe renderizar el título y la cantidad de opiniones publicadas", () => {
    const { container } = render(<MuroOpiniones opiniones={mockOpiniones} />);
    expect(screen.getByText("Opiniones de la comunidad")).toBeInTheDocument();
    expect(container.querySelector("p")?.textContent).toMatch(/opini[oó]nes publicadas/i);
  });

  it("debe renderizar las tarjetas con los datos de las opiniones", () => {
    render(<MuroOpiniones opiniones={mockOpiniones} />);
    expect(screen.getByText("Excelente torneo")).toBeInTheDocument();
    expect(screen.getByText("Más pantallas gigantes")).toBeInTheDocument();
  });

  it("debe filtrar correctamente por categoría", () => {
    render(<MuroOpiniones opiniones={mockOpiniones} />);
    const selectCategoria = screen.getByLabelText("Filtrar por categoría");

    fireEvent.change(selectCategoria, { target: { value: "ORGANIZACION" } });

    expect(screen.getByText("Excelente torneo")).toBeInTheDocument();
    expect(
      screen.queryByText("Más pantallas gigantes"),
    ).not.toBeInTheDocument();
  });

  it("debe filtrar correctamente por puntuación de estrellas", () => {
    render(<MuroOpiniones opiniones={mockOpiniones} />);
    const selectEstrellas = screen.getByLabelText("Filtrar por estrellas");

    fireEvent.change(selectEstrellas, { target: { value: "4" } });

    expect(screen.getByText("Más pantallas gigantes")).toBeInTheDocument();
    expect(screen.queryByText("Excelente torneo")).not.toBeInTheDocument();
  });
});
