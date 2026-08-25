"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search, Moon, Sun, LogOut, Loader2 } from "lucide-react";
import {
  searchEntities,
  getModalSelectOptions,
  type SearchResult,
} from "@/features/search/actions";
import { toast } from "sonner";

import { ModalAgregarLuchador } from "@/features/luchadores/components/admin/modals/ModalAgregarLuchador";
import { ModalEditarLuchador } from "@/features/luchadores/components/admin/modals/ModalEditarLuchador";
import { ModalEquipo } from "@/features/equipos/components/admin/modals/ModalEquipo";
import { ModalCombate } from "@/features/combates/components/ModalCombate";
import { ModalEvento } from "@/features/eventos/components/ModalEvento";

import type { LuchadorRow } from "@/app/dashboard/luchadores/columns";
import type { EquipoData } from "@/features/equipos/components/admin/modals/ModalEquipo";
import type { CombateData } from "@/features/combates/components/ModalCombate";
import type { EventoData } from "@/features/eventos/components/ModalEvento";

import { deleteLuchador } from "@/features/luchadores/actions";
import { deleteEquipo } from "@/features/equipos/actions";

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

import { useCommandKeyboard } from "./hooks/useCommandKeyboard";
import { useCommandSearch } from "./hooks/useCommandSearch";
import { CommandSearchResults } from "./CommandSearchResults";
import { CommandScopeTabs } from "./CommandScopeTabs";
import { CommandCollapsibleGroup } from "./CommandCollapsibleGroup";
import {
  COMMAND_SCOPE_TABS,
  COMMAND_SECTIONS,
  COMMAND_ACTION_ITEMS,
} from "./config";
import type { CommandItemConfig, CommandScopeId } from "./types";

type FormSelectOptions = {
  luchadores: { id: string; nombre: string; apellido: string; apodo: string }[];
  eventos: { id: string; numero: number }[];
  categorias: { id: string; nombre: string }[];
  modalidades: { id: string; nombre: string }[];
};

type CommandMenuProps = {
  userPermissions: string[];
};

const GROUP_ACTIONS_ID = "quick-actions";
const GROUP_PREFERENCES_ID = "preferences";

function hasPermission(permissions: string[], required?: string): boolean {
  if (!required) return true;
  return permissions.includes(required);
}

export function CommandMenu({ userPermissions }: CommandMenuProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [activeScope, setActiveScope] = React.useState<CommandScopeId>("all");

  // Each group tracks its own collapsed/expanded state.
  const [expandedGroups, setExpandedGroups] = React.useState<
    Record<string, boolean>
  >({});

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

  const { searchResults, setSearchResults, isSearching, groupedResults } =
    useCommandSearch(inputValue);

  // ─── Derived ──────────────────────────────────────────────────────────────

  const hasSearchQuery = inputValue.trim().length >= 2;
  const hasResults = searchResults.length > 0;

  const visibleSections = React.useMemo(
    () =>
      COMMAND_SECTIONS.filter(
        (s) => activeScope === "all" || s.scope === activeScope,
      ),
    [activeScope],
  );

  const visibleActionItems = React.useMemo(
    () =>
      COMMAND_ACTION_ITEMS.filter((a) =>
        hasPermission(userPermissions, a.permission),
      ),
    [userPermissions],
  );

  const showActionsTab = visibleActionItems.length > 0;

  const visibleScopeTabs = React.useMemo(
    () =>
      COMMAND_SCOPE_TABS.filter((t) => t.id !== "actions" || showActionsTab),
    [showActionsTab],
  );

  // ─── Handlers ─────────────────────────────────────────────────────────────

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
  }, [setTheme, theme]);

  const handleLogout = React.useCallback(async () => {
    setOpen(false);
    setInputValue("");
    const { logoutUser } = await import("@/features/auth/actions");
    await logoutUser();
  }, []);

  const collapsibleActionItems = React.useMemo<CommandItemConfig[]>(
    () =>
      visibleActionItems.map((item) => ({
        label: item.label,
        icon: item.icon,
        keywords: item.keywords,
        shortcut: item.shortcut,
        onSelect: () => {
          setOpen(false);
          setActiveCreateModal(item.actionKey);
        },
      })),
    [visibleActionItems],
  );

  const collapsiblePreferenceItems = React.useMemo<CommandItemConfig[]>(
    () => [
      {
        label:
          theme === "dark" ? "Cambiar a Tema Claro" : "Cambiar a Tema Oscuro",
        icon: theme === "dark" ? Sun : Moon,
        keywords: "cambiar tema dark light modo oscuro claro theme toggle",
        shortcut: "T T",
        onSelect: toggleTheme,
      },
      {
        label: "Cerrar Sesión",
        icon: LogOut,
        keywords: "cerrar sesion logout salir desconectar sign out",
        shortcut: "Q Q",
        onSelect: handleLogout,
      },
    ],
    [theme, toggleTheme, handleLogout],
  );

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        setInputValue("");
        setSearchResults([]);
      }
    },
    [setSearchResults],
  );

  const handleScopeChange = React.useCallback((scope: CommandScopeId) => {
    setActiveScope(scope);
    setInputValue("");
  }, []);

  const toggleGroup = React.useCallback((id: string) => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleEdit = React.useCallback((item: SearchResult) => {
    setOpen(false);
    if (item.category === "luchadores")
      setEditLuchador(item.rawData as LuchadorRow);
    else if (item.category === "equipos")
      setEditEquipo(item.rawData as EquipoData);
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
      if (deleteTarget.category === "luchadores")
        res = await deleteLuchador(deleteTarget.id);
      else if (deleteTarget.category === "equipos")
        res = await deleteEquipo(deleteTarget.id);

      if (res.success) {
        toast.success("Eliminado correctamente", { position: "top-center" });
        if (inputValue.trim().length >= 2) {
          const searchRes = await searchEntities(inputValue);
          if (searchRes.success && searchRes.data)
            setSearchResults(searchRes.data);
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
  }, [deleteTarget, inputValue, setSearchResults]);

  React.useEffect(() => {
    if (activeCreateModal === "combate" || editCombate !== null) {
      getModalSelectOptions().then((res) => {
        if (res.success && res.data) setSelectOptions(res.data);
      });
    }
  }, [activeCreateModal, editCombate]);

  useCommandKeyboard({
    userPermissions,
    setOpen,
    setActiveCreateModal,
    toggleTheme,
    handleLogout,
  });

  const showActionSection =
    (activeScope === "all" || activeScope === "actions") &&
    visibleActionItems.length > 0;

  const showPreferencesSection =
    activeScope === "all" || activeScope === "settings";

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative h-9 w-1/2 justify-start gap-2 rounded-lg bg-muted/50 px-3 text-sm text-muted-foreground shadow-none hover:bg-muted/80 sm:w-64"
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
        description="Busca secciones, configuraciones, acciones o entidades del sistema."
      >
        <Command>
          <CommandInput
            placeholder="Escribe un comando o busca..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          {!hasSearchQuery && (
            <CommandScopeTabs
              tabs={visibleScopeTabs}
              activeScope={activeScope}
              onScopeChange={handleScopeChange}
            />
          )}

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
              <CommandSearchResults
                groupedResults={groupedResults}
                userPermissions={userPermissions}
                onNavigate={navigate}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            {activeScope !== "actions" &&
              visibleSections.map((section, sectionIdx) => {
                const permittedSubgroups = section.subgroups
                  .map((sg) => ({
                    ...sg,
                    items: sg.items.filter((item) =>
                      hasPermission(userPermissions, item.permission),
                    ),
                  }))
                  .filter((sg) => sg.items.length > 0);

                if (permittedSubgroups.length === 0) return null;

                return (
                  <React.Fragment key={section.scope}>
                    {sectionIdx > 0 && <CommandSeparator />}
                    {permittedSubgroups.map((sg) => (
                      <CommandCollapsibleGroup
                        key={sg.id}
                        id={sg.id}
                        heading={sg.heading}
                        items={sg.items}
                        isExpanded={hasSearchQuery || !!expandedGroups[sg.id]}
                        onToggle={toggleGroup}
                        onNavigate={navigate}
                      />
                    ))}
                  </React.Fragment>
                );
              })}

            {showActionSection && (
              <>
                <CommandSeparator />
                <CommandCollapsibleGroup
                  id={GROUP_ACTIONS_ID}
                  heading="Acciones Rápidas"
                  items={collapsibleActionItems}
                  isExpanded={
                    hasSearchQuery || !!expandedGroups[GROUP_ACTIONS_ID]
                  }
                  onToggle={toggleGroup}
                  onNavigate={navigate}
                />
              </>
            )}

            {showPreferencesSection && (
              <>
                <CommandSeparator />
                <CommandCollapsibleGroup
                  id={GROUP_PREFERENCES_ID}
                  heading="Preferencias"
                  items={collapsiblePreferenceItems}
                  isExpanded={
                    hasSearchQuery || !!expandedGroups[GROUP_PREFERENCES_ID]
                  }
                  onToggle={toggleGroup}
                  onNavigate={navigate}
                />
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>

      {activeCreateModal === "luchador" && (
        <ModalAgregarLuchador
          open
          onOpenChange={(o) => {
            if (!o) setActiveCreateModal(null);
          }}
          onSubmit={() => router.refresh()}
        />
      )}
      {activeCreateModal === "equipo" && (
        <ModalEquipo
          open
          onOpenChange={(o) => {
            if (!o) setActiveCreateModal(null);
          }}
        />
      )}
      {activeCreateModal === "combate" && (
        <ModalCombate
          open
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
          open
          onOpenChange={(o) => {
            if (!o) setActiveCreateModal(null);
          }}
        />
      )}

      {editLuchador && (
        <ModalEditarLuchador
          luchador={editLuchador}
          open
          onOpenChange={(o) => {
            if (!o) setEditLuchador(null);
          }}
          onSubmit={() => router.refresh()}
        />
      )}
      {editEquipo && (
        <ModalEquipo
          equipo={editEquipo}
          open
          onOpenChange={(o) => {
            if (!o) setEditEquipo(null);
          }}
        />
      )}
      {editCombate && (
        <ModalCombate
          combate={editCombate}
          open
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
          open
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
