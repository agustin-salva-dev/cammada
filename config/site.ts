export const siteConfig = {
  name: "Cammada Fight Session",
  shortName: "Cammada",
  url: "https://cammada.com",
  description:
    "Organización independiente de deportes de combate del Norte Argentino. Seguí las carteleras, rankings, luchadores y todos los detalles de cada edición de Cammada Fight Session.",
  location: {
    ciudad: "Salta Capital",
    provincia: "Salta",
    pais: "Argentina",
    region: "Norte Argentino",
  },
  socialLinks: {
    instagram: "https://www.instagram.com/cammada_fight_session",
    youtube: "https://www.youtube.com/@cammadafightsession",
    tiktok: "https://www.tiktok.com/@cammada24",
  },
  foundedYear: 2023,
} as const;

export type SiteConfig = typeof siteConfig;
