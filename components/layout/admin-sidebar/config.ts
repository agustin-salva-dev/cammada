import {
  LayoutDashboard,
  Users,
  Shield,
  Swords,
  CalendarDays,
  Trophy,
  Weight,
  Medal,
  MessageSquare,
  Globe,
  Vote,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { SidebarNavSectionConfig } from "./types";

export const SIDEBAR_SECTIONS: Record<string, SidebarNavSectionConfig> = {
  main: {
    title: "Principal",
    items: [
      {
        title: "Dashboard",
        url: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        publicUrl: ROUTES.HOME,
        publicLabel: "Ver web pública",
      },
    ],
  },
  competition: {
    title: "Competición & Eventos",
    items: [
      {
        title: "Eventos",
        url: ROUTES.DASHBOARD_EVENTOS,
        icon: CalendarDays,
        publicUrl: ROUTES.EVENTOS,
        publicLabel: "Ver eventos públicos",
      },
      {
        title: "Combates",
        url: ROUTES.DASHBOARD_COMBATES,
        icon: Swords,
      },
      {
        title: "Luchadores",
        url: ROUTES.DASHBOARD_LUCHADORES,
        icon: Users,
        publicUrl: ROUTES.LUCHADORES,
        publicLabel: "Ver luchadores públicos",
      },
      {
        title: "Talento Exportado",
        url: ROUTES.DASHBOARD_EXPORTADOS,
        icon: Globe,
        publicUrl: ROUTES.TALENTO_EXPORTADO,
        publicLabel: "Ver talento exportado público",
      },
      {
        title: "Equipos",
        url: ROUTES.DASHBOARD_EQUIPOS,
        icon: Shield,
        publicUrl: ROUTES.EQUIPOS,
        publicLabel: "Ver equipos públicos",
      },
      {
        title: "Rankings",
        url: ROUTES.DASHBOARD_RANKINGS,
        icon: Trophy,
        publicUrl: ROUTES.RANKINGS,
        publicLabel: "Ver rankings públicos",
      },
    ],
  },
  parameters: {
    title: "Parámetros Deportivos",
    items: [
      {
        title: "Categorías de Peso",
        url: ROUTES.DASHBOARD_CATEGORIAS_PESO,
        icon: Weight,
      },
      {
        title: "Modalidades de Combate",
        url: ROUTES.DASHBOARD_MODALIDADES,
        icon: Medal,
      },
    ],
  },
  community: {
    title: "Comunidad & Feedback",
    items: [
      {
        title: "Opiniones",
        url: ROUTES.DASHBOARD_OPINIONES,
        icon: MessageSquare,
        publicUrl: ROUTES.OPINIONES,
        publicLabel: "Ver opiniones públicas",
      },
      {
        title: "Predicciones",
        url: ROUTES.DASHBOARD_PREDICCIONES,
        icon: Vote,
        publicUrl: ROUTES.PREDICCIONES,
        publicLabel: "Ver predicciones públicas",
      },
    ],
  },
};
