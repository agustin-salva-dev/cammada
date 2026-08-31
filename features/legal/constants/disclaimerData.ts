import type { LegalDocument } from "../types";

export const disclaimerData: LegalDocument = {
  title: "Descargo de Responsabilidad",
  lastUpdated: "27 de agosto de 2026",
  version: "1.0",
  sections: [
    {
      id: "deportes-combate",
      title: "1. Naturaleza de los Deportes de Combate",
      clauses: [
        {
          text: "Cammada Fight Session organiza eventos de deportes de combate, incluyendo Artes Marciales Mixtas (MMA), Kickboxing y Grappling. Estas disciplinas son deportes de contacto que, por su naturaleza, implican riesgos físicos inherentes para los atletas participantes.",
        },
        {
          text: "Todos los combates organizados por Cammada se realizan bajo reglamentos deportivos establecidos, con supervisión médica, árbitros certificados y cumpliendo con los estándares de seguridad correspondientes. Los atletas participan de manera voluntaria, con plena conciencia de los riesgos propios de la disciplina.",
        },
        {
          text: "El contenido de esta Plataforma —incluyendo videos, fotos, resultados y estadísticas— tiene carácter informativo y de entretenimiento deportivo. Cammada no promueve ni incita a la violencia fuera del contexto deportivo reglamentado.",
        },
      ],
    },
    {
      id: "no-apuestas",
      title: "2. Sistema de Predicciones: Carácter No-Apuesta",
      clauses: [
        {
          text: "El sistema de predicciones disponible en la Plataforma es una funcionalidad recreativa y comunitaria de carácter absolutamente gratuito.",
        },
        {
          text: "Cammada Fight Session NO es, bajo ninguna circunstancia, un sitio de apuestas deportivas ni opera como operador de juegos de azar. En particular:",
          items: [
            "Ninguna predicción implica el depósito, transferencia o pérdida de dinero real o activos de ningún tipo.",
            "No existen premios económicos, créditos canjeables por dinero ni ningún otro incentivo de valor material asociado a las predicciones.",
            "El sistema de predicciones no está regulado por la legislación de juego o apuestas deportivas, dado que no constituye ninguna de estas actividades.",
            "La participación en el sistema de predicciones es voluntaria, gratuita y tiene como único fin el entretenimiento deportivo de la comunidad.",
          ],
        },
      ],
    },
    {
      id: "exactitud-datos",
      title: "3. Exactitud de la Información Publicada",
      clauses: [
        {
          text: "Cammada se esfuerza por mantener la información de la Plataforma actualizada y precisa. Sin embargo:",
          items: [
            "Los récords y estadísticas de atletas se basan en fuentes públicas especializadas (Sherdog, Tapology) y pueden no reflejar en tiempo real los últimos resultados de combates externos a Cammada.",
            "Las carteleras, fechas, horarios y ubicaciones de eventos están sujetos a cambios. Ante cualquier modificación, se notificará a través de los canales oficiales de la organización.",
            "Cammada no garantiza la exactitud absoluta de la información y no asume responsabilidad por errores u omisiones.",
          ],
        },
      ],
    },
    {
      id: "eventos-externos",
      title: "4. Eventos y Promotoras Externas",
      clauses: [
        {
          text: "Cammada actúa como plataforma de difusión para atletas del Norte Argentino que participan en eventos organizados por terceras promotoras nacionales e internacionales. En estos casos:",
          items: [
            "Cammada no es parte organizadora de dichos eventos externos.",
            "Los contratos, condiciones económicas y acuerdos entre los atletas y las promotoras externas son responsabilidad exclusiva de las partes involucradas.",
            "La información sobre participaciones internacionales se publica con fines informativos y de difusión deportiva.",
          ],
        },
      ],
    },
    {
      id: "enlaces-externos",
      title: "5. Enlace a Sitios de Terceros",
      clauses: [
        {
          text: "La Plataforma puede contener enlaces a sitios web de terceros (Mercado Pago, Sherdog, Tapology, redes sociales, entre otros). Cammada no controla el contenido de dichos sitios y no asume ninguna responsabilidad por ellos. El acceso a estos sitios se realiza bajo la responsabilidad exclusiva del usuario.",
        },
      ],
    },
    {
      id: "menores",
      title: "6. Menores de Edad",
      clauses: [
        {
          text: "El contenido de los eventos de deportes de combate puede no ser apto para todos los públicos. Se recomienda que los menores de edad accedan a la Plataforma bajo supervisión parental o adulta responsable.",
        },
      ],
    },
  ],
};
