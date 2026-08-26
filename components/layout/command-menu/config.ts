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
  Home,
  PenLine,
  User,
  UserCog,
  ShieldCheck,
  UserPlus,
  Plus,
  Vote,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type {
  CommandScopeTab,
  CommandSectionConfig,
  CommandActionItem,
} from "./types";

// ─── Scope Tabs ──────────────────────────────────────────────────────────────

export const COMMAND_SCOPE_TABS: CommandScopeTab[] = [
  { id: "all", label: "Todos", icon: LayoutDashboard },
  { id: "admin", label: "Admin", icon: Shield },
  { id: "web", label: "Web", icon: Globe },
  { id: "settings", label: "Ajustes", icon: ShieldCheck },
  { id: "actions", label: "Acciones", icon: Plus },
];

// ─── Sections ─────────────────────────────────────────────────────────────────

export const COMMAND_SECTIONS: CommandSectionConfig[] = [
  // ── Administración ───────────────────────────────────────────────────────
  {
    scope: "admin",
    subgroups: [
      {
        id: "admin-competition",
        heading: "Competición & Eventos",
        items: [
          {
            label: "Eventos",
            icon: CalendarDays,
            route: ROUTES.DASHBOARD_EVENTOS,
            permission: "eventos:ver",
            shortcut: "G E",
            keywords:
              "evento eventos cartelera cartel veladas velada ediciones edicion admin gestionar programar calendar",
          },
          {
            label: "Combates",
            icon: Swords,
            route: ROUTES.DASHBOARD_COMBATES,
            permission: "combates:ver",
            shortcut: "G C",
            keywords:
              "combate combates pelea peleas enfrentamientos enfrentamiento fights fight admin rounds",
          },
          {
            label: "Luchadores",
            icon: Users,
            route: ROUTES.DASHBOARD_LUCHADORES,
            permission: "luchadores:ver",
            shortcut: "G L",
            keywords:
              "luchador luchadores peleador peleadores atleta atletas roster admin ficha perfil pesaje fighter",
          },
          {
            label: "Talento Exportado",
            icon: Globe,
            route: ROUTES.DASHBOARD_EXPORTADOS,
            permission: "exportados:ver",
            shortcut: "G T",
            keywords:
              "talento exportado talentos exportados internacional ufc pfl bellator exterior mundo admin",
          },
          {
            label: "Equipos",
            icon: Shield,
            route: ROUTES.DASHBOARD_EQUIPOS,
            permission: "equipos:ver",
            shortcut: "G Q",
            keywords:
              "equipo equipos gimnasio gimnasios gym gyms academias academia teams team admin",
          },
          {
            label: "Rankings",
            icon: Trophy,
            route: ROUTES.DASHBOARD_RANKINGS,
            permission: "rankings:ver",
            shortcut: "G R",
            keywords:
              "ranking rankings clasificacion clasificaciones tablas tabla posiciones posicion mejores admin top",
          },
        ],
      },
      {
        id: "admin-parameters",
        heading: "Parámetros Deportivos",
        items: [
          {
            label: "Categorías de Peso",
            icon: Weight,
            route: ROUTES.DASHBOARD_CATEGORIAS_PESO,
            permission: "categorias:ver",
            shortcut: "G P",
            keywords:
              "categoria categorias peso division divisiones pesaje libras kilos flyweight lightweight admin",
          },
          {
            label: "Modalidades de Combate",
            icon: Medal,
            route: ROUTES.DASHBOARD_MODALIDADES,
            permission: "modalidades:ver",
            shortcut: "G M",
            keywords:
              "modalidad modalidades combate combates mma bjj kickboxing muay thai grappling admin disciplina",
          },
        ],
      },
      {
        id: "admin-community",
        heading: "Comunidad & Feedback",
        items: [
          {
            label: "Opiniones",
            icon: MessageSquare,
            route: ROUTES.DASHBOARD_OPINIONES,
            permission: "opiniones:ver",
            shortcut: "G O",
            keywords:
              "opinion opiniones feedback comentario comentarios comunidad reseñas reseña valoraciones moderacion admin",
          },
          {
            label: "Predicciones",
            icon: Vote,
            route: ROUTES.DASHBOARD_PREDICCIONES,
            permission: "predicciones:ver",
            shortcut: "G P",
            keywords:
              "prediccion predicciones votos votar peleadores cartelera combate admin gestionar",
          },
        ],
      },
    ],
  },

  // ── Web Pública ───────────────────────────────────────────────────────────
  {
    scope: "web",
    subgroups: [
      {
        id: "web-general",
        heading: "General",
        items: [
          {
            label: "Inicio",
            icon: Home,
            route: ROUTES.HOME,
            shortcut: "P H",
            keywords:
              "inicio home web publica portal principal cammada pagina landing",
          },
          {
            label: "Eventos",
            icon: CalendarDays,
            route: ROUTES.EVENTOS,
            shortcut: "P E",
            keywords:
              "evento eventos cartelera cartel proximos veladas velada galeria fechas web publica",
          },
          {
            label: "Rankings",
            icon: Trophy,
            route: ROUTES.RANKINGS,
            shortcut: "P R",
            keywords:
              "ranking rankings clasificaciones clasificacion posiciones posicion mejores peleadores peleador web publica top",
          },
        ],
      },
      {
        id: "web-competition",
        heading: "Competición",
        items: [
          {
            label: "Luchadores",
            icon: Users,
            route: ROUTES.LUCHADORES,
            shortcut: "P L",
            keywords:
              "luchador luchadores peleador peleadores catalogo atletas atleta roster web publica bio ficha",
          },
          {
            label: "Equipos",
            icon: Shield,
            route: ROUTES.EQUIPOS,
            shortcut: "P Q",
            keywords:
              "equipo equipos gym gyms gimnasio gimnasios academias academia teams team web publica directorio",
          },
          {
            label: "Talento Exportado",
            icon: Globe,
            route: ROUTES.TALENTO_EXPORTADO,
            shortcut: "P T",
            keywords:
              "talento exportado talentos exportados ufc internacional exterior mundo web publica orgullo",
          },
        ],
      },
      {
        id: "web-community",
        heading: "Comunidad",
        items: [
          {
            label: "Opiniones de la Comunidad",
            icon: MessageSquare,
            route: ROUTES.OPINIONES,
            shortcut: "P O",
            keywords:
              "opinion opiniones comunidad valoracion valoraciones review reviews feedback comentario comentarios web",
          },
          {
            label: "Deja tu opinión",
            icon: PenLine,
            route: ROUTES.OPINAR,
            shortcut: "P F",
            keywords:
              "opinar opinion feedback dejar opinion formulario reseña reseñas escribe escribir web",
          },
          {
            label: "Predicciones de Combates",
            icon: Vote,
            route: ROUTES.PREDICCIONES,
            shortcut: "P P",
            keywords:
              "prediccion predicciones votar combate peleas cartelera ganador comunidad votos web",
          },
        ],
      },
    ],
  },

  // ── Configuración & Seguridad ─────────────────────────────────────────────
  {
    scope: "settings",
    subgroups: [
      {
        id: "settings-account",
        heading: "Cuenta & Seguridad",
        items: [
          {
            label: "Perfil",
            icon: User,
            route: `${ROUTES.DASHBOARD_SETTINGS}?tab=perfil`,
            shortcut: "S P",
            keywords:
              "ajustes configuracion perfil mi cuenta usuario settings nombre email foto imagen password clave contrasena",
          },
          {
            label: "Usuarios y Cuentas",
            icon: UserCog,
            route: `${ROUTES.DASHBOARD_SETTINGS}?tab=usuarios`,
            permission: "ajustes:gestionar_cuentas",
            shortcut: "S U",
            keywords:
              "ajustes usuarios usuario cuentas cuenta miembros miembro administradores administrador registro settings acceso",
          },
          {
            label: "Roles y Permisos",
            icon: ShieldCheck,
            route: `${ROUTES.DASHBOARD_SETTINGS}?tab=roles`,
            permission: "ajustes:configurar_roles",
            shortcut: "S R",
            keywords:
              "ajustes roles rol permisos permiso configuracion seguridad autorizaciones settings access control autorizacion",
          },
          {
            label: "Registrar Administrador",
            icon: UserPlus,
            route: ROUTES.ADMIN_REGISTER,
            permission: "ajustes:gestionar_cuentas",
            shortcut: "A R",
            keywords:
              "crear cuenta registrar usuario nuevo administrador administradores register sign up agregar rol",
          },
        ],
      },
    ],
  },
];

// ─── Quick Actions ─────────────────────────────────────────────────────────────

export const COMMAND_ACTION_ITEMS: CommandActionItem[] = [
  {
    label: "Crear Luchador",
    icon: Plus,
    actionKey: "luchador",
    permission: "luchadores:crear",
    shortcut: "N L",
    keywords:
      "crear nuevo luchador luchadores peleador peleadores agregar atleta atletas inscribir registrar",
  },
  {
    label: "Crear Equipo",
    icon: Plus,
    actionKey: "equipo",
    permission: "equipos:crear",
    shortcut: "N Q",
    keywords:
      "crear nuevo equipo equipos gimnasio gimnasios agregar gym gyms academia academias club",
  },
  {
    label: "Crear Combate",
    icon: Plus,
    actionKey: "combate",
    permission: "combates:crear",
    shortcut: "N C",
    keywords:
      "crear nuevo combate combates pelea peleas agregar enfrentamiento enfrentamientos bout",
  },
  {
    label: "Crear Evento",
    icon: Plus,
    actionKey: "evento",
    permission: "eventos:crear",
    shortcut: "N E",
    keywords:
      "crear nuevo evento eventos fecha fechas cartelera agregar edicion edicion velada",
  },
];
