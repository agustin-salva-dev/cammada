import { describe, it, expect } from "vitest";
import { parseTargetDate } from "@/features/eventos/hooks/useEventCountdown";

describe("parseTargetDate", () => {
  it("parsea correctamente la fecha ISO en string y horaInicio como hora de Argentina", () => {
    // Supongamos que la fecha guardada es "2026-07-22T00:00:00.000Z" y horaInicio es "18:30"
    const fechaStr = "2026-07-22T00:00:00.000Z";
    const horaInicio = "18:30";
    const target = parseTargetDate(fechaStr, horaInicio);

    // En UTC representation: "2026-07-22 18:30" Argentina es "2026-07-22 21:30" UTC
    expect(target.getUTCFullYear()).toBe(2026);
    expect(target.getUTCMonth()).toBe(6); // Julio
    expect(target.getUTCDate()).toBe(22);
    expect(target.getUTCHours()).toBe(21);
    expect(target.getUTCMinutes()).toBe(30);
  });

  it("utiliza la horaInicio dada si la fecha viene como objeto Date", () => {
    const fechaObj = new Date("2026-07-22T00:00:00.000Z");
    const horaInicio = "21:15";
    const target = parseTargetDate(fechaObj, horaInicio);

    // En UTC: "2026-07-22 21:15" Argentina es "2026-07-23 00:15" UTC
    expect(target.getUTCFullYear()).toBe(2026);
    expect(target.getUTCMonth()).toBe(6);
    expect(target.getUTCDate()).toBe(23);
    expect(target.getUTCHours()).toBe(0);
    expect(target.getUTCMinutes()).toBe(15);
  });
});
