import type { LegalDocument } from "../types";

export const cookiesData: LegalDocument = {
  title: "Política de Cookies",
  lastUpdated: "27 de agosto de 2026",
  version: "1.0",
  sections: [
    {
      id: "que-son",
      title: "1. ¿Qué son las Cookies?",
      clauses: [
        {
          text: "Las cookies son pequeños archivos de texto que los sitios web almacenan en el navegador del usuario al visitarlos. Se utilizan para recordar preferencias, mantener sesiones activas y mejorar la experiencia de uso.",
        },
      ],
    },
    {
      id: "que-usamos",
      title: "2. ¿Qué Cookies Utilizamos?",
      clauses: [
        {
          text: "Cammada Fight Session utiliza exclusivamente cookies técnicas y de preferencias propias. NO utilizamos cookies de terceros, publicidad, remarketing ni perfilado comportamental.",
          items: [
            "Cookie de sesión de administración (next-auth.session-token): utilizada exclusivamente para mantener activa la sesión de los usuarios con acceso al panel de administración. No se aplica a visitantes del sitio público.",
            "Cookie de tema visual (cammada-theme): almacena la preferencia del usuario respecto al tema visual de la Plataforma (modo oscuro o claro). No contiene datos personales.",
            "Cookie de consentimiento (cammada-cookie-consent): registra en el navegador si el usuario ya ha visto y aceptado el banner de consentimiento de cookies, para no mostrarlo en cada visita.",
          ],
        },
      ],
    },
    {
      id: "no-usamos",
      title: "3. Cookies que NO Utilizamos",
      clauses: [
        {
          text: "Cammada NO instala ni permite la instalación de:",
          items: [
            "Cookies de Google Analytics, Google Ads, Meta Pixel ni de ningún servicio de analítica de terceros.",
            "Cookies de redes sociales (Facebook, Instagram, Twitter/X).",
            "Cookies de publicidad programática o retargeting.",
            "Cualquier otra cookie que rastree el comportamiento del usuario en otros sitios web.",
          ],
        },
      ],
    },
    {
      id: "consentimiento",
      title: "4. Consentimiento y Control",
      clauses: [
        {
          text: "Al acceder a la Plataforma, verás un banner informativo sobre el uso de cookies. Podés aceptar las cookies para continuar navegando con todas las funcionalidades disponibles.",
        },
        {
          text: "Dado que solo utilizamos cookies técnicas y de preferencias necesarias para el funcionamiento básico del sitio, estas cookies no requieren consentimiento explícito según la normativa vigente. Sin embargo, te informamos sobre ellas en pos de la transparencia.",
        },
      ],
    },
    {
      id: "gestion",
      title: "5. Cómo Gestionar o Eliminar las Cookies",
      clauses: [
        {
          text: "Podés gestionar o eliminar las cookies de la Plataforma directamente desde la configuración de tu navegador:",
          items: [
            "Google Chrome: Configuración → Privacidad y seguridad → Cookies y otros datos de sitios.",
            "Mozilla Firefox: Configuración → Privacidad y seguridad → Cookies y datos del sitio.",
            "Microsoft Edge: Configuración → Privacidad, búsqueda y servicios → Cookies.",
            "Safari (macOS/iOS): Preferencias → Privacidad → Administrar datos del sitio web.",
          ],
        },
        {
          text: "Ten en cuenta que deshabilitar las cookies técnicas puede afectar el funcionamiento de algunas funcionalidades de la Plataforma, como la persistencia del tema visual.",
        },
      ],
    },
    {
      id: "actualizaciones",
      title: "6. Actualizaciones de esta Política",
      clauses: [
        {
          text: "Esta Política de Cookies puede ser actualizada para reflejar cambios en la Plataforma o en la normativa aplicable. La versión vigente estará siempre disponible en esta página.",
        },
      ],
    },
  ],
};
