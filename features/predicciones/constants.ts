export const MAX_PREDICCIONES_CARTELERA_PRINCIPAL = 10;

export const TIPOS_COMBATE_CON_PREDICCION = [
  "ESTELAR",
  "CO_ESTELAR",
  "CARTELERA_PRINCIPAL",
] as const;

export type TipoCombateConPrediccion =
  (typeof TIPOS_COMBATE_CON_PREDICCION)[number];

export const TIPO_COMBATE_PREDICCION_LABEL: Record<
  TipoCombateConPrediccion,
  string
> = {
  ESTELAR: "Pelea Estelar",
  CO_ESTELAR: "Co-Estelar",
  CARTELERA_PRINCIPAL: "Cartelera Principal",
};

export const CACHE_TAG_PREDICCIONES = "predicciones";
export const CACHE_TAG_PREDICCIONES_DASHBOARD = "predicciones-dashboard";
