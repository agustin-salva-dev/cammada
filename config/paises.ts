/**
 * Datos centralizados de países y ciudades para formularios.
 * Usados tanto en equipos como en luchadores.
 */

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
  "Salta",
  "Buenos Aires",
  "Córdoba",
  "Rosario",
  "Jujuy",
  "Tucumán",
  "Mendoza",
] as const;

export type Pais = (typeof PAISES)[number];
export type Ciudad = (typeof CIUDADES)[number];
