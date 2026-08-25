"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

function hasPermission(permissions: string[], required?: string): boolean {
  if (!required) return true;
  return permissions.includes(required);
}

interface UseCommandKeyboardOptions {
  userPermissions: string[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveCreateModal: (
    modal: "luchador" | "equipo" | "combate" | "evento",
  ) => void;
  toggleTheme: () => void;
  handleLogout: () => void;
}

export function useCommandKeyboard({
  userPermissions,
  setOpen,
  setActiveCreateModal,
  toggleTheme,
  handleLogout,
}: UseCommandKeyboardOptions) {
  const router = useRouter();

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

        // Panel de Administración (G ...)
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
        } else if (
          sequence === "g t" &&
          hasPermission(userPermissions, "exportados:ver")
        ) {
          e.preventDefault();
          router.push(ROUTES.DASHBOARD_EXPORTADOS);
        } else if (
          sequence === "g r" &&
          hasPermission(userPermissions, "rankings:ver")
        ) {
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
        } else if (
          sequence === "g o" &&
          hasPermission(userPermissions, "opiniones:ver")
        ) {
          e.preventDefault();
          router.push(ROUTES.DASHBOARD_OPINIONES);
        } else if (sequence === "g s") {
          e.preventDefault();
          router.push(ROUTES.DASHBOARD_SETTINGS);
        }

        // Web Pública (P ...)
        else if (sequence === "p h") {
          e.preventDefault();
          router.push(ROUTES.HOME);
        } else if (sequence === "p e") {
          e.preventDefault();
          router.push(ROUTES.EVENTOS);
        } else if (sequence === "p r") {
          e.preventDefault();
          router.push(ROUTES.RANKINGS);
        } else if (sequence === "p l") {
          e.preventDefault();
          router.push(ROUTES.LUCHADORES);
        } else if (sequence === "p q") {
          e.preventDefault();
          router.push(ROUTES.EQUIPOS);
        } else if (sequence === "p t") {
          e.preventDefault();
          router.push(ROUTES.TALENTO_EXPORTADO);
        } else if (sequence === "p o") {
          e.preventDefault();
          router.push(ROUTES.OPINIONES);
        } else if (sequence === "p f") {
          e.preventDefault();
          router.push(ROUTES.OPINAR);
        } else if (sequence === "p p") {
          e.preventDefault();
          router.push(ROUTES.PREDICCIONES);
        }

        // Ajustes y Configuración (S ... y A ...)
        else if (sequence === "s p") {
          e.preventDefault();
          router.push(`${ROUTES.DASHBOARD_SETTINGS}?tab=profile`);
        } else if (
          sequence === "s u" &&
          hasPermission(userPermissions, "ajustes:gestionar_cuentas")
        ) {
          e.preventDefault();
          router.push(`${ROUTES.DASHBOARD_SETTINGS}?tab=users`);
        } else if (
          sequence === "s r" &&
          hasPermission(userPermissions, "ajustes:configurar_roles")
        ) {
          e.preventDefault();
          router.push(`${ROUTES.DASHBOARD_SETTINGS}?tab=roles`);
        } else if (sequence === "s s") {
          e.preventDefault();
          router.push(`${ROUTES.DASHBOARD_SETTINGS}?tab=system`);
        } else if (
          sequence === "a r" &&
          hasPermission(userPermissions, "ajustes:gestionar_cuentas")
        ) {
          e.preventDefault();
          router.push(ROUTES.ADMIN_REGISTER);
        }

        // Acciones Rápidas de Creación (N ...)
        else if (
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
        }

        // Preferencias (T T / Q Q)
        else if (sequence === "t t") {
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

      if (
        key === "g" ||
        key === "p" ||
        key === "s" ||
        key === "a" ||
        key === "n" ||
        key === "t" ||
        key === "q"
      ) {
        lastKey = key;
        lastTime = now;
      } else {
        lastKey = "";
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    userPermissions,
    router,
    setOpen,
    setActiveCreateModal,
    toggleTheme,
    handleLogout,
  ]);
}
