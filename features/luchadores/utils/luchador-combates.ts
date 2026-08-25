import type { LuchadorPublico } from "../actions/public";

export type LuchadorCombateRaw = NonNullable<
  LuchadorPublico["combatesComoPel1"]
>[number];

export function getLuchadorTotales(records: LuchadorPublico["records"]) {
  const victorias = records.reduce((sum, r) => sum + r.victorias, 0);
  const derrotas = records.reduce((sum, r) => sum + r.derrotas, 0);
  const empates = records.reduce((sum, r) => sum + r.empates, 0);
  return { victorias, derrotas, empates };
}

export function getCombatesOrdenados(
  combatesComoPel1: LuchadorPublico["combatesComoPel1"] = [],
  combatesComoPel2: LuchadorPublico["combatesComoPel2"] = [],
): LuchadorCombateRaw[] {
  const raw = [...(combatesComoPel1 || []), ...(combatesComoPel2 || [])];
  const map = new Map<string, LuchadorCombateRaw>();
  raw.forEach((c) => map.set(c.id, c));

  return Array.from(map.values()).sort((a, b) => {
    const fechaA = a.evento?.fecha ? new Date(a.evento.fecha).getTime() : 0;
    const fechaB = b.evento?.fecha ? new Date(b.evento.fecha).getTime() : 0;
    if (fechaB !== fechaA) return fechaB - fechaA;
    return (b.evento?.numero ?? 0) - (a.evento?.numero ?? 0);
  });
}
