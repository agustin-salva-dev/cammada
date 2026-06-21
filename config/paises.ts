export const PAISES = [
  "Argentina",
  "Bolivia",
  "Chile",
  "Paraguay",
  "Uruguay",
  "Brasil",
  "Perú",
] as const;

export const CIUDADES = [
  "Salta (Capital)",
  "Salta (Oran)",
  "Salta (Guemes)",
  "Jujuy",
  "Tucumán",
  "Mendoza",
  "Córdoba",
  "Buenos Aires",
] as const;

export type Pais = (typeof PAISES)[number];
export type Ciudad = (typeof CIUDADES)[number];
