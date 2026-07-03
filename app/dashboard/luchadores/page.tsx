import { Button } from "@/components/ui/button";
import { BadgePlus, Download, Sparkles } from "lucide-react";
import { IconButtonConfig } from "@/constants/ui";
import { ModalAgregarLuchador } from "@/components/luchadores/modals/ModalAgregarLuchador";
import { ModalImportarLuchador } from "@/components/luchadores/modals/ModalImportarLuchador";
import { getLuchadores } from "@/features/luchadores/actions";
import { LuchadoresTable } from "./luchadores-table";
import type { LuchadorRow } from "./columns";

export default async function Luchadores() {
  const result = await getLuchadores();

  const luchadores: LuchadorRow[] =
    result.success && result.data ? (result.data as LuchadorRow[]) : [];

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Luchadores</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona todos los peleadores registrados en el sistema.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download strokeWidth={IconButtonConfig.strokeWidth} />
            Exportar luchadores
          </Button>
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
        </div>
      </div>

      <LuchadoresTable
        data={luchadores}
        categorias={categorias}
        equipos={equipos}
      />
    </main>
  );
}
