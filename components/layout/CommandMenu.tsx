"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Search,
  LayoutDashboard,
  Users,
  Shield,
  Swords,
  CalendarDays,
  Trophy,
  Weight,
  Medal,
  Settings,
  Plus,
  Moon,
  Sun,
  LogOut,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  searchEntities,
  getModalSelectOptions,
  type SearchResult,
} from "@/features/search/actions";
import { toast } from "sonner";

import { ModalAgregarLuchador } from "@/features/luchadores/components/ModalAgregarLuchador";
import { ModalEditarLuchador } from "@/features/luchadores/components/ModalEditarLuchador";
import { ModalEquipo } from "@/features/equipos/components/ModalEquipo";
import { ModalCombate } from "@/features/combates/components/ModalCombate";
import { ModalEvento } from "@/features/eventos/components/ModalEvento";

import type { LuchadorRow } from "@/app/dashboard/luchadores/columns";
import type { EquipoData } from "@/features/equipos/components/ModalEquipo";
import type { CombateData } from "@/features/combates/components/ModalCombate";
import type { EventoData } from "@/features/eventos/components/ModalEvento";

import { deleteLuchador } from "@/features/luchadores/actions";
import { deleteEquipo } from "@/features/equipos/actions";
import { deleteCombate } from "@/features/combates/actions";
import { deleteEvento } from "@/features/eventos/actions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type NavigationItem = {
  label: string;
  icon: React.ElementType;
  route: string;
  permission?: string;
  shortcut: string;
};

type ActionItem = {
  label: string;
  icon: React.ElementType;
  actionKey: "luchador" | "equipo" | "combate" | "evento";
  permission: string;
  shortcut: string;
};

type CommandMenuProps = {
  userPermissions: string[];
};

type FormSelectOptions = {
  luchadores: { id: string; nombre: string; apellido: string; apodo: string }[];
  eventos: { id: string; numero: number }[];
  categorias: { id: string; nombre: string }[];
  modalidades: { id: string; nombre: string }[];
};

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    route: ROUTES.DASHBOARD,
    shortcut: "G D",
  },
  {
    label: "Luchadores",
    icon: Users,
    route: ROUTES.DASHBOARD_LUCHADORES,
    permission: "luchadores:ver",
    shortcut: "G L",
  },
  {
    label: "Equipos",
    icon: Shield,
    route: ROUTES.DASHBOARD_EQUIPOS,
    permission: "equipos:ver",
    shortcut: "G Q",
  },
  {
    label: "Combates",
    icon: Swords,
    route: ROUTES.DASHBOARD_COMBATES,
    permission: "combates:ver",
    shortcut: "G C",
  },
  {
    label: "Eventos",
    icon: CalendarDays,
    route: ROUTES.DASHBOARD_EVENTOS,
    permission: "eventos:ver",
    shortcut: "G E",
  },
  {
    label: "Rankings",
    icon: Trophy,
    route: ROUTES.DASHBOARD_RANKINGS,
    shortcut: "G R",
  },
  {
    label: "Categorías de Peso",
    icon: Weight,
    route: ROUTES.DASHBOARD_CATEGORIAS_PESO,
    permission: "categorias:ver",
    shortcut: "G P",
  },
  {
    label: "Modalidades",
    icon: Medal,
    route: ROUTES.DASHBOARD_MODALIDADES,
    permission: "modalidades:ver",
    shortcut: "G M",
  },
  {
    label: "Ajustes",
    icon: Settings,
    route: ROUTES.DASHBOARD_SETTINGS,
    shortcut: "G S",
  },
];

const ACTION_ITEMS: ActionItem[] = [
  {
    label: "Crear Luchador",
    icon: Plus,
    actionKey: "luchador",
    permission: "luchadores:crear",
    shortcut: "N L",
  },
  {
    label: "Crear Equipo",
    icon: Plus,
    actionKey: "equipo",
    permission: "equipos:crear",
    shortcut: "N Q",
  },
  {
    label: "Crear Combate",
    icon: Plus,
    actionKey: "combate",
    permission: "combates:crear",
    shortcut: "N C",
  },
  {
    label: "Crear Evento",
    icon: Plus,
    actionKey: "evento",
    permission: "eventos:crear",
    shortcut: "N E",
  },
];

const SEARCH_CATEGORY_LABELS: Record<SearchResult["category"], string> = {
  luchadores: "Luchadores",
  equipos: "Equipos",
  combates: "Combates",
  eventos: "Eventos",
};

const SEARCH_CATEGORY_ICONS: Record<
  SearchResult["category"],
  React.ElementType
> = {
  luchadores: Users,
  equipos: Shield,
  combates: Swords,
  eventos: CalendarDays,
};

function hasPermission(permissions: string[], required?: string): boolean {
  if (!required) return true;
  return permissions.includes(required);
}

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export function CommandMenu({ userPermissions }: CommandMenuProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectOptions, setSelectOptions] = React.useState<FormSelectOptions>({
    luchadores: [],
    eventos: [],
    categorias: [],
    modalidades: [],
  });

  const [activeCreateModal, setActiveCreateModal] = React.useState<
    "luchador" | "equipo" | "combate" | "evento" | null
  >(null);
  const [editLuchador, setEditLuchador] = React.useState<LuchadorRow | null>(
    null,
  );
  const [editEquipo, setEditEquipo] = React.useState<EquipoData | null>(null);
  const [editCombate, setEditCombate] = React.useState<CombateData | null>(
    null,
  );
  const [editEvento, setEditEvento] = React.useState<EventoData | null>(null);

  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    label: string;
    category: SearchResult["category"];
  } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const debouncedQuery = useDebounce(inputValue, 300);

  React.useEffect(() => {
    getModalSelectOptions().then((res) => {
      if (res.success && res.data) {
        setSelectOptions(res.data);
      }
    });
  }, []);

  const filteredNavItems = React.useMemo(
    () =>
      NAVIGATION_ITEMS.filter((item) =>
        hasPermission(userPermissions, item.permission),
      ),
    [userPermissions],
  );

  const filteredActionItems = React.useMemo(
    () =>
      ACTION_ITEMS.filter((item) =>
        hasPermission(userPermissions, item.permission),
      ),
    [userPermissions],
  );

  const navigate = React.useCallback(
    (route: string) => {
      setOpen(false);
      setInputValue("");
      router.push(route);
    },
    [router],
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
    setOpen(false);
    setInputValue("");
  }, [theme, setTheme]);

  const handleLogout = React.useCallback(async () => {
    setOpen(false);
    setInputValue("");
    const { logoutUser } = await import("@/features/auth/actions");
    await logoutUser();
  }, []);

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setInputValue("");
      setSearchResults([]);
    }
  }, []);

  const handleEdit = React.useCallback((item: SearchResult) => {
    setOpen(false);
    if (item.category === "luchadores") {
      setEditLuchador(item.rawData as LuchadorRow);
    } else if (item.category === "equipos") {
      setEditEquipo(item.rawData as EquipoData);
    } else if (item.category === "combates") {
      setEditCombate(item.rawData as CombateData);
    } else if (item.category === "eventos") {
      setEditEvento(item.rawData as EventoData);
    }
  }, []);

  const handleDelete = React.useCallback((item: SearchResult) => {
    setOpen(false);
    setDeleteTarget({
      id: item.id,
      label: item.label,
      category: item.category,
    });
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      let res: { success: boolean; error?: string } = { success: false };
      if (deleteTarget.category === "luchadores") {
        res = await deleteLuchador(deleteTarget.id);
      } else if (deleteTarget.category === "equipos") {
        res = await deleteEquipo(deleteTarget.id);
      } else if (deleteTarget.category === "combates") {
        res = await deleteCombate(deleteTarget.id);
      } else if (deleteTarget.category === "eventos") {
        res = await deleteEvento(deleteTarget.id);
      }

      if (res.success) {
        toast.success("Eliminado correctamente", { position: "top-center" });
        if (inputValue.trim().length >= 2) {
          const searchRes = await searchEntities(inputValue);
          if (searchRes.success && searchRes.data) {
            setSearchResults(searchRes.data);
          }
        }
      } else {
        toast.error("Error al eliminar: " + (res.error || "Error desconocido"));
      }
    } catch (err) {
      console.error(err);
      toast.error(
        "Ocurrió un error inesperado al intentar eliminar el registro.",
      );
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, inputValue]);

  React.useEffect(() => {
    let lastKey = "";
    let lastTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const now = Date.now();

      if (now - lastTime < 800 && lastKey) {
        const sequence = `${lastKey} ${key}`;

        if (sequence === "g d") {
          e.preventDefault();
          router.push(ROUTES.DASHBOARD);
        } else if (
          sequence === "g l" &&
          hasPermission(userPermissions, "luchadores:ver")
        ) {
          e.preventDefault();
          router.push(ROUTES.DASHBOARD_LUCHADORES);
        } else if (
          sequence === "g q" &&
          hasPermission(userPermissions, "equipos:ver")
        ) {
          e.preventDefault();
          router.push(ROUTES.DASHBOARD_EQUIPOS);
        } else if (
          sequence === "g c" &&
          hasPermission(userPermissions, "combates:ver")
        ) {
          e.preventDefault();
          router.push(ROUTES.DASHBOARD_COMBATES);
        } else if (
          sequence === "g e" &&
          hasPermission(userPermissions, "eventos:ver")
        ) {
          e.preventDefault();
          router.push(ROUTES.DASHBOARD_EVENTOS);
        } else if (sequence === "g r") {
          e.preventDefault();
          router.push(ROUTES.DASHBOARD_RANKINGS);
        } else if (
          sequence === "g p" &&
          hasPermission(userPermissions, "categorias:ver")
        ) {
          e.preventDefault();
          router.push(ROUTES.DASHBOARD_CATEGORIAS_PESO);
        } else if (
          sequence === "g m" &&
          hasPermission(userPermissions, "modalidades:ver")
        ) {
          e.preventDefault();
          router.push(ROUTES.DASHBOARD_MODALIDADES);
        } else if (sequence === "g s") {
          e.preventDefault();
          router.push(ROUTES.DASHBOARD_SETTINGS);
        } else if (
          sequence === "n l" &&
          hasPermission(userPermissions, "luchadores:crear")
        ) {
          e.preventDefault();
          setActiveCreateModal("luchador");
        } else if (
          sequence === "n q" &&
          hasPermission(userPermissions, "equipos:crear")
        ) {
          e.preventDefault();
          setActiveCreateModal("equipo");
        } else if (
          sequence === "n c" &&
          hasPermission(userPermissions, "combates:crear")
        ) {
          e.preventDefault();
          setActiveCreateModal("combate");
        } else if (
          sequence === "n e" &&
          hasPermission(userPermissions, "eventos:crear")
        ) {
          e.preventDefault();
          setActiveCreateModal("evento");
        } else if (sequence === "t t") {
          e.preventDefault();
          toggleTheme();
        } else if (sequence === "q q") {
          e.preventDefault();
          handleLogout();
        }

        lastKey = "";
        lastTime = 0;
        return;
      }

      if (key === "g" || key === "n" || key === "t" || key === "q") {
        lastKey = key;
        lastTime = now;
      } else {
        lastKey = "";
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [userPermissions, router, toggleTheme, handleLogout]);

  React.useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      const timer = setTimeout(() => {
        setSearchResults([]);
      }, 0);
      return () => clearTimeout(timer);
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      setIsSearching(true);
    }, 0);

    searchEntities(debouncedQuery).then((res) => {
      if (cancelled) return;
      setIsSearching(false);
      if (res.success && res.data) {
        setSearchResults(res.data);
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [debouncedQuery]);

  const groupedResults = React.useMemo(() => {
    const groups: Partial<Record<SearchResult["category"], SearchResult[]>> =
      {};
    for (const result of searchResults) {
      if (!groups[result.category]) {
        groups[result.category] = [];
      }
      groups[result.category]!.push(result);
    }
    return groups;
  }, [searchResults]);

  const hasSearchQuery = inputValue.trim().length >= 2;
  const hasResults = searchResults.length > 0;

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative h-9 w-full max-w-sm justify-start gap-2 rounded-lg bg-muted/50 px-3 text-sm text-muted-foreground shadow-none hover:bg-muted/80 sm:w-64"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline-flex">Buscar...</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Paleta de Comandos"
        description="Busca secciones, acciones o entidades del sistema."
      >
        <Command shouldFilter={!hasSearchQuery}>
          <CommandInput
            placeholder="Escribe un comando o busca..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              {isSearching ? (
                <span className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Buscando...
                </span>
              ) : (
                "No se encontraron resultados."
              )}
            </CommandEmpty>

            {hasSearchQuery && hasResults && (
              <>
                {(
                  Object.entries(groupedResults) as [
                    SearchResult["category"],
                    SearchResult[],
                  ][]
                ).map(([category, items]) => {
                  const Icon = SEARCH_CATEGORY_ICONS[category];
                  return (
                    <CommandGroup
                      key={category}
                      heading={SEARCH_CATEGORY_LABELS[category]}
                    >
                      {items.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={`${item.label} ${item.description ?? ""}`}
                          onSelect={() => navigate(item.url)}
                          className="flex items-center justify-between group/item"
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <Icon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex flex-col min-w-0">
                              <span className="truncate">{item.label}</span>
                              {item.description && (
                                <span className="text-xs text-muted-foreground truncate">
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 focus-within/item:opacity-100 transition-opacity ml-2 shrink-0">
                            {hasPermission(
                              userPermissions,
                              `${item.category}:editar`,
                            ) && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(item);
                                }}
                                title="Editar"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            {hasPermission(
                              userPermissions,
                              `${item.category}:eliminar`,
                            ) && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item);
                                }}
                                title="Eliminar"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  );
                })}
                <CommandSeparator />
              </>
            )}

            <CommandGroup heading="Navegación">
              {filteredNavItems.map((item) => (
                <CommandItem
                  key={item.route}
                  value={item.label}
                  onSelect={() => navigate(item.route)}
                >
                  <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{item.label}</span>
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            {filteredActionItems.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Acciones Rápidas">
                  {filteredActionItems.map((item) => (
                    <CommandItem
                      key={`action-${item.actionKey}`}
                      value={item.label}
                      onSelect={() => {
                        setOpen(false);
                        setActiveCreateModal(item.actionKey);
                      }}
                    >
                      <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{item.label}</span>
                      <CommandShortcut>{item.shortcut}</CommandShortcut>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            <CommandSeparator />
            <CommandGroup heading="Preferencias">
              <CommandItem value="Cambiar Tema" onSelect={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="mr-2 h-4 w-4 text-muted-foreground" />
                ) : (
                  <Moon className="mr-2 h-4 w-4 text-muted-foreground" />
                )}
                <span>Cambiar Tema</span>
                <CommandShortcut>T T</CommandShortcut>
              </CommandItem>
              <CommandItem value="Cerrar Sesión" onSelect={handleLogout}>
                <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Cerrar Sesión</span>
                <CommandShortcut>Q Q</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      {activeCreateModal === "luchador" && (
        <ModalAgregarLuchador
          open={true}
          onOpenChange={(o) => {
            if (!o) setActiveCreateModal(null);
          }}
          onSubmit={() => {
            router.refresh();
          }}
        />
      )}

      {activeCreateModal === "equipo" && (
        <ModalEquipo
          open={true}
          onOpenChange={(o) => {
            if (!o) setActiveCreateModal(null);
          }}
        />
      )}

      {activeCreateModal === "combate" && (
        <ModalCombate
          open={true}
          onOpenChange={(o) => {
            if (!o) setActiveCreateModal(null);
          }}
          luchadores={selectOptions.luchadores}
          eventos={selectOptions.eventos}
          categorias={selectOptions.categorias}
          modalidades={selectOptions.modalidades}
        />
      )}

      {activeCreateModal === "evento" && (
        <ModalEvento
          open={true}
          onOpenChange={(o) => {
            if (!o) setActiveCreateModal(null);
          }}
        />
      )}

      {editLuchador && (
        <ModalEditarLuchador
          luchador={editLuchador}
          open={true}
          onOpenChange={(o) => {
            if (!o) setEditLuchador(null);
          }}
          onSubmit={() => {
            router.refresh();
          }}
        />
      )}

      {editEquipo && (
        <ModalEquipo
          equipo={editEquipo}
          open={true}
          onOpenChange={(o) => {
            if (!o) setEditEquipo(null);
          }}
        />
      )}

      {editCombate && (
        <ModalCombate
          combate={editCombate}
          open={true}
          onOpenChange={(o) => {
            if (!o) setEditCombate(null);
          }}
          luchadores={selectOptions.luchadores}
          eventos={selectOptions.eventos}
          categorias={selectOptions.categorias}
          modalidades={selectOptions.modalidades}
        />
      )}

      {editEvento && (
        <ModalEvento
          evento={editEvento}
          open={true}
          onOpenChange={(o) => {
            if (!o) setEditEvento(null);
          }}
        />
      )}

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => {
          if (!o && !isDeleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar permanentemente a:{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.label}
              </span>
              . Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? "Eliminando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
