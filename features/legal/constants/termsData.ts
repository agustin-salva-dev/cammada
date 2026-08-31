import type { LegalDocument } from "../types";

export const termsData: LegalDocument = {
  title: "Términos y Condiciones de Uso",
  lastUpdated: "27 de agosto de 2026",
  version: "1.0",
  sections: [
    {
      id: "aceptacion",
      title: "1. Aceptación de los Términos",
      clauses: [
        {
          text: "Al acceder y utilizar la plataforma web de Cammada Fight Session (en adelante, «la Plataforma» o «Cammada»), el usuario declara haber leído, comprendido y aceptado en su totalidad los presentes Términos y Condiciones de Uso. Si no estás de acuerdo con alguno de ellos, te pedimos que no utilices la Plataforma.",
        },
        {
          text: "Estos Términos rigen la relación entre Cammada Fight Session y cualquier persona que acceda o utilice la Plataforma, sea de manera registrada o anónima.",
        },
      ],
    },
    {
      id: "descripcion",
      title: "2. Descripción de la Plataforma",
      clauses: [
        {
          text: "Cammada Fight Session es una organización independiente de eventos deportivos de artes marciales mixtas (MMA), kickboxing y grappling, con sede en Salta Capital, Argentina. La Plataforma tiene como finalidad:",
          items: [
            "Publicar y difundir información sobre los eventos organizados por Cammada Fight Session (carteleras, combates, resultados, estadísticas).",
            "Mostrar perfiles y récords de luchadores que han participado en alguna edición de nuestros eventos.",
            "Ofrecer rankings deportivos por categoría y modalidad.",
            "Facilitar la venta de entradas para los eventos.",
            "Brindar a la comunidad una sección de predicciones recreativas y un espacio de opiniones y sugerencias.",
            "Difundir a los atletas del Norte Argentino que participan en eventos deportivos nacionales e internacionales.",
          ],
        },
      ],
    },
    {
      id: "entradas",
      title: "3. Compra de Entradas y Sistema de Tickets",
      clauses: [
        {
          text: "La Plataforma permite la adquisición de entradas para los eventos de Cammada Fight Session de forma digital, directamente a través de este sitio web.",
        },
        {
          text: "Condiciones de compra:",
          items: [
            "Las entradas son nominales: quedan asociadas al nombre del comprador y generan un código QR único para su validación en el acceso al evento.",
            "El pago se procesa a través de la plataforma Mercado Pago. Cammada no almacena datos de tarjetas de crédito, débito ni datos bancarios de ningún tipo.",
            "Una vez confirmado el pago, el ticket digital (con código QR) será enviado al correo electrónico indicado y/o estará disponible en la plataforma.",
            "Las entradas no son transferibles ni reembolsables, salvo en caso de cancelación del evento por parte de Cammada Fight Session.",
            "En caso de cancelación del evento, se comunicará a los compradores los mecanismos de reembolso disponibles.",
            "El usuario es responsable de cuidar y no compartir su código QR. Cammada no se responsabiliza por el uso indebido de entradas por parte de terceros.",
          ],
        },
      ],
    },
    {
      id: "predicciones",
      title: "4. Sistema de Predicciones y Votaciones",
      clauses: [
        {
          text: "La sección de predicciones de Cammada es una funcionalidad recreativa y comunitaria de carácter completamente gratuito.",
          items: [
            "Las predicciones consisten en emitir un voto de apoyo a uno de los peleadores en un combate determinado, sin ningún tipo de apuesta monetaria.",
            "Cammada Fight Session NO es un sitio de apuestas y NO opera bajo ninguna modalidad de juego de azar con dinero real. Ninguna predicción o votación implica, directa ni indirectamente, apuestas económicas de ningún tipo.",
            "La participación en predicciones no genera premios económicos ni de ninguna otra especie.",
            "Para garantizar la integridad del sistema, se registra un hash unidireccional de la dirección IP del usuario para limitar un voto por combate por dispositivo.",
          ],
        },
      ],
    },
    {
      id: "opiniones",
      title: "5. Opiniones y Comentarios de la Comunidad",
      clauses: [
        {
          text: "La Plataforma dispone de un espacio para que la comunidad comparta comentarios y sugerencias sobre los eventos y la organización.",
        },
        {
          text: "Normas de conducta obligatorias para el uso de la sección de opiniones:",
          items: [
            "Toda opinión o comentario es revisado por un administrador de Cammada antes de ser publicado públicamente.",
            "Queda expresamente prohibido publicar contenido ofensivo, discriminatorio, difamatorio, con discurso de odio, spam, contenido ilegal o cualquier material que vulnere derechos de terceros.",
            "Cammada se reserva el derecho de rechazar, eliminar o responder a cualquier opinión que incumpla estas normas.",
            "El usuario que envíe una opinión es el único responsable de su contenido.",
          ],
        },
      ],
    },
    {
      id: "atletas",
      title: "6. Perfiles de Atletas y Derechos de Imagen",
      clauses: [
        {
          text: "Los perfiles de luchadores publicados en la Plataforma corresponden exclusivamente a atletas que han participado en al menos una edición de los eventos de Cammada Fight Session.",
        },
        {
          text: "Cammada NO posee derechos de imagen exclusivos, contratos de exclusividad ni ninguna relación contractual de largo plazo con los atletas exhibidos, más allá de los acuerdos específicos celebrados para cada evento particular.",
        },
        {
          text: "Los récords, estadísticas y resultados publicados son de carácter informativo y están basados en registros públicos disponibles en plataformas especializadas como Sherdog y Tapology. Cammada no garantiza la exactitud absoluta de estos datos.",
        },
        {
          text: "En el caso de atletas exportados a eventos internacionales, Cammada actúa como difusor y vitrina de los atletas del Norte Argentino. Los contratos y acuerdos económicos con otras promotoras internacionales son gestionados directamente por estas organizaciones y los propios atletas, sin intervención de Cammada.",
        },
      ],
    },
    {
      id: "propiedad-intelectual",
      title: "7. Propiedad Intelectual",
      clauses: [
        {
          text: "El contenido de la Plataforma (textos, diseño, código, logotipos y elementos gráficos propios de Cammada) es propiedad de Cammada Fight Session. Está prohibida su reproducción total o parcial sin autorización expresa.",
        },
      ],
    },
    {
      id: "responsabilidad",
      title: "8. Limitación de Responsabilidad",
      clauses: [
        {
          text: "Cammada Fight Session no será responsable por:",
          items: [
            "Interrupciones, errores o fallos técnicos en el funcionamiento de la Plataforma.",
            "Inexactitudes en los datos estadísticos de atletas provenientes de fuentes externas.",
            "El contenido de sitios web de terceros a los que se pueda acceder mediante enlaces desde la Plataforma.",
            "Cualquier daño derivado del uso indebido de la Plataforma por parte del usuario.",
          ],
        },
      ],
    },
    {
      id: "ley-aplicable",
      title: "9. Ley Aplicable y Jurisdicción",
      clauses: [
        {
          text: "Los presentes Términos y Condiciones se rigen por las leyes de la República Argentina. Ante cualquier controversia, las partes se someten a la jurisdicción de los tribunales competentes de la Ciudad de Salta, Argentina.",
        },
      ],
    },
    {
      id: "modificaciones",
      title: "10. Modificaciones",
      clauses: [
        {
          text: "Cammada se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones serán publicadas en esta página con la fecha de actualización. El uso continuado de la Plataforma luego de dichas modificaciones implicará la aceptación de los nuevos términos.",
        },
      ],
    },
  ],
};
