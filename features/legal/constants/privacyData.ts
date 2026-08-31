import type { LegalDocument } from "../types";

export const privacyData: LegalDocument = {
  title: "Política de Privacidad",
  lastUpdated: "27 de agosto de 2026",
  version: "1.0",
  sections: [
    {
      id: "objeto",
      title: "1. Objeto e Identificación del Responsable",
      clauses: [
        {
          text: "La presente Política de Privacidad regula el tratamiento de los datos personales de los usuarios que accedan y utilicen la plataforma web de Cammada Fight Session (en adelante, «Cammada» o «la Plataforma»), de conformidad con la Ley N° 25.326 de Protección de los Datos Personales de la República Argentina y sus normas reglamentarias.",
        },
        {
          text: "El responsable del tratamiento de los datos es Cammada Fight Session, organización independiente de eventos deportivos de artes marciales mixtas con base en Salta Capital, Argentina. Contacto para asuntos de privacidad: legal@cammada.com.",
        },
      ],
    },
    {
      id: "datos-recolectados",
      title: "2. Datos Personales que Recolectamos",
      clauses: [
        {
          text: "Cammada recopila únicamente los datos estrictamente necesarios para el funcionamiento de la Plataforma. A continuación se detallan las categorías:",
          items: [
            "Usuarios Administradores: nombre, correo electrónico y contraseña hasheada (bcrypt). Estos datos son necesarios para gestionar el panel de administración y no son accesibles públicamente.",
            "Hash de Dirección IP (ipHash): al participar en predicciones, votaciones o enviar opiniones, se genera un hash unidireccional irreversible de la dirección IP del usuario. Este hash se utiliza exclusivamente para prevenir votos y opiniones duplicadas. No permite identificar al usuario ni rastrear su navegación.",
            "Opiniones y comentarios: el nombre de usuario (opcional, puede ser anónimo), rol como participante y el contenido del comentario o sugerencia enviado voluntariamente a través de la Plataforma.",
          ],
        },
      ],
    },
    {
      id: "no-recolectados",
      title: "3. Datos que NO Recolectamos",
      clauses: [
        {
          text: "Cammada NO recolecta, almacena ni procesa:",
          items: [
            "Datos de navegación completos ni historial de visitas.",
            "Datos financieros o bancarios de ningún tipo.",
            "Datos de geolocalización precisa.",
            "Datos personales de menores de edad.",
            "Cookies de publicidad, remarketing o perfilado comportamental de terceros.",
          ],
        },
      ],
    },
    {
      id: "finalidad",
      title: "4. Finalidad del Tratamiento",
      clauses: [
        {
          text: "Los datos recolectados son utilizados para las siguientes finalidades legítimas:",
          items: [
            "Gestión de cuentas de usuarios administradores y control de acceso al panel de administración.",
            "Prevención de spam y abuso en el sistema de predicciones, votaciones y opiniones mediante el hash de IP.",
            "Moderación de opiniones y comentarios previo a su publicación pública.",
            "Comunicación con los usuarios que se pongan en contacto voluntariamente.",
          ],
        },
      ],
    },
    {
      id: "cookies",
      title: "5. Cookies y Tecnologías de Seguimiento",
      clauses: [
        {
          text: "Cammada utiliza únicamente cookies de carácter técnico y de preferencias necesarias para el funcionamiento de la Plataforma. No se utilizan cookies de seguimiento, publicidad ni de terceros. Para información detallada, consultá nuestra Política de Cookies.",
        },
      ],
    },
    {
      id: "transferencia",
      title: "6. Transferencia de Datos a Terceros",
      clauses: [
        {
          text: "Cammada no vende, cede, transfiere ni comparte los datos personales de sus usuarios con terceros, salvo en los siguientes casos de estricta necesidad:",
          items: [
            "Mercado Pago: al procesar el pago de entradas, el usuario es redirigido a la plataforma de Mercado Pago. El tratamiento de datos de pago es responsabilidad exclusiva de Mercado Pago y se rige por sus propias políticas de privacidad.",
            "Obligaciones legales: cuando sea requerido por autoridades judiciales o gubernamentales competentes de la República Argentina.",
          ],
        },
      ],
    },
    {
      id: "seguridad",
      title: "7. Seguridad de los Datos",
      clauses: [
        {
          text: "Implementamos medidas de seguridad técnicas y organizativas razonables para proteger los datos personales contra acceso no autorizado, pérdida, alteración o divulgación, incluyendo: hasheo de contraseñas (bcrypt), hasheo unidireccional de IPs, comunicaciones HTTPS y control de acceso basado en roles.",
        },
      ],
    },
    {
      id: "derechos-arco",
      title:
        "8. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)",
      clauses: [
        {
          text: "De conformidad con la Ley N° 25.326 y sus modificatorias, los titulares de datos personales tienen derecho a:",
          items: [
            "Acceso: conocer qué datos personales tenemos almacenados sobre usted.",
            "Rectificación: corregir datos inexactos o incompletos.",
            "Cancelación/Supresión: solicitar la eliminación de sus datos cuando ya no sean necesarios.",
            "Oposición: oponerse al tratamiento de sus datos en determinados casos.",
          ],
        },
        {
          text: "Para ejercer cualquiera de estos derechos, podés enviar tu solicitud al correo legal@cammada.com. Responderemos en un plazo máximo de 30 días hábiles.",
        },
        {
          text: "La Dirección Nacional de Protección de Datos Personales (DNPDP) es el organismo de control competente en la materia. Para más información: https://www.argentina.gob.ar/aaip/datospersonales.",
        },
      ],
    },
    {
      id: "retencion",
      title: "9. Retención de Datos",
      clauses: [
        {
          text: "Los datos se conservan durante el tiempo estrictamente necesario para cumplir con las finalidades descritas. Los hashes de IP utilizados para control de duplicados se conservan mientras sea necesario para mantener la integridad de las votaciones y predicciones activas.",
        },
      ],
    },
    {
      id: "modificaciones",
      title: "10. Modificaciones a esta Política",
      clauses: [
        {
          text: "Cammada se reserva el derecho de actualizar esta Política de Privacidad para reflejar cambios normativos o en las prácticas de la Plataforma. La versión vigente estará siempre disponible en esta página con su fecha de actualización. El uso continuado de la Plataforma implica la aceptación de la versión actualizada.",
        },
      ],
    },
    {
      id: "contacto",
      title: "11. Contacto",
      clauses: [
        {
          text: "Para consultas relacionadas con esta Política de Privacidad o el tratamiento de tus datos personales, podés contactarnos en: legal@cammada.com.",
        },
      ],
    },
  ],
};
