export const PERMISSIONS = {
  LUCHADORES: {
    VER: "luchadores:ver",
    CREAR: "luchadores:crear",
    EDITAR: "luchadores:editar",
    ELIMINAR: "luchadores:eliminar",
  },
  EQUIPOS: {
    VER: "equipos:ver",
    CREAR: "equipos:crear",
    EDITAR: "equipos:editar",
    ELIMINAR: "equipos:eliminar",
  },
  COMBATES: {
    VER: "combates:ver",
    CREAR: "combates:crear",
    EDITAR: "combates:editar",
    ELIMINAR: "combates:eliminar",
  },
  EVENTOS: {
    VER: "eventos:ver",
    CREAR: "eventos:crear",
    EDITAR: "eventos:editar",
    ELIMINAR: "eventos:eliminar",
  },
  CATEGORIAS: {
    VER: "categorias:ver",
    CREAR: "categorias:crear",
    EDITAR: "categorias:editar",
    ELIMINAR: "categorias:eliminar",
  },
  MODALIDADES: {
    VER: "modalidades:ver",
    CREAR: "modalidades:crear",
    EDITAR: "modalidades:editar",
    ELIMINAR: "modalidades:eliminar",
  },
  RANKINGS: {
    VER: "rankings:ver",
    CREAR: "rankings:crear",
    EDITAR: "rankings:editar",
    ELIMINAR: "rankings:eliminar",
  },
  AJUSTES: {
    GESTIONAR_CUENTAS: "ajustes:gestionar_cuentas",
    CONFIGURAR_ROLES: "ajustes:configurar_roles",
  },
} as const;

export const ALL_PERMISSIONS = Object.values(PERMISSIONS).flatMap((group) =>
  Object.values(group),
);
export const PERMISSION_GROUP_LABELS: Record<string, string> = {
  LUCHADORES: "Luchadores",
  EQUIPOS: "Equipos",
  COMBATES: "Combates",
  EVENTOS: "Eventos",
  CATEGORIAS: "Categorías de Peso",
  MODALIDADES: "Modalidades",
  AJUSTES: "Ajustes",
};

export const PERMISSION_ACTION_LABELS: Record<string, string> = {
  ver: "Ver",
  crear: "Crear",
  editar: "Editar",
  eliminar: "Eliminar",
  gestionar_cuentas: "Gestionar Cuentas",
  configurar_roles: "Configurar Roles",
};

export const SYSTEM_ROLES = ["SUPERADMIN", "ADMIN", "AYUDANTE"] as const;

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPERADMIN: ALL_PERMISSIONS,
  ADMIN: ALL_PERMISSIONS.filter((p) => p !== "ajustes:configurar_roles"),
  AYUDANTE: ALL_PERMISSIONS.filter(
    (p) => p.endsWith(":ver") && !p.startsWith("ajustes:"),
  ),
};
