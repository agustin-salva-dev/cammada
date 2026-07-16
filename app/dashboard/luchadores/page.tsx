import { Button } from "@/components/ui/button";
import { BadgePlus, Download, Sparkles } from "lucide-react";
import { IconButtonConfig } from "@/constants/ui";
import { ModalAgregarLuchador } from "@/features/luchadores/components/ModalAgregarLuchador";
import { ModalImportarLuchador } from "@/features/luchadores/components/ModalImportarLuchador";
import { getLuchadores } from "@/features/luchadores/actions";
import { LuchadoresTable } from "./luchadores-table";
import type { LuchadorRow } from "./columns";
import { hasPermission } from "@/lib/action-guard";
import { PERMISSIONS } from "@/constants/permissions";

export default async function Luchadores() {
  const [result, canCreate, canEdit, canDelete] = await Promise.all([
    getLuchadores(),
    hasPermission(PERMISSIONS.LUCHADORES.CREAR),
    hasPermission(PERMISSIONS.LUCHADORES.EDITAR),
    hasPermission(PERMISSIONS.LUCHADORES.ELIMINAR),
  ]);

  const luchadores: LuchadorRow[] =
    result.success && result.data
      ? (result.data.luchadores as LuchadorRow[])
      : [];

  const categorias = [
    ...new Set(
      luchadores
        .map((l) => l.categoria?.nombre)
        .filter((name): name is string => !!name && name !== "Sin categoría"),
    ),
  ].sort();

  const equipos = [
    ...new Set(
      luchadores
        .map((l) => l.equipo?.nombre)
        .filter((name): name is string => !!name && name !== "Sin equipo"),
    ),
  ].sort();

  return (
    <main className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row items-center gap-5 sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Luchadores</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona todos los peleadores registrados en el sistema.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline">
            <Download strokeWidth={IconButtonConfig.strokeWidth} />
            Exportar luchadores
          </Button>
          {canCreate && (
            <>
              <ModalImportarLuchador
                trigger={
                  <Button variant="secondary">
                    <Sparkles strokeWidth={IconButtonConfig.strokeWidth} />
                    Importar Tapology
                  </Button>
                }
              />
              <ModalAgregarLuchador
                trigger={
                  <Button>
                    <BadgePlus strokeWidth={IconButtonConfig.strokeWidth} />
                    Nuevo luchador
                  </Button>
                }
              />
            </>
          )}
        </div>
      </div>

      <LuchadoresTable
        data={luchadores}
        categorias={categorias}
        equipos={equipos}
        canEdit={canEdit}
        canDelete={canDelete}
      />
    </main>
  );
}
