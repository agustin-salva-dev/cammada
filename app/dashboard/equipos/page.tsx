import { Button } from "@/components/ui/button";
import { BadgePlus, Download, Users, Plus } from "lucide-react";
import { IconButtonConfig } from "@/components/layout/DashboardHeader";
import { getEquipos } from "@/features/equipos/actions";
import { CardEquipo } from "@/features/equipos/components/CardEquipo";
import { ModalEquipo } from "@/features/equipos/components/ModalEquipo";

export default async function Equipos() {
  const result = await getEquipos();
  const equipos = result.success && result.data ? result.data : [];

  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Equipos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona todos los equipos registrados en el sistema.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Button variant="outline" className="border-border/50 hover:bg-muted/50">
            <Download strokeWidth={IconButtonConfig.strokeWidth} />
            Exportar equipos
          </Button>
          <ModalEquipo
            trigger={
              <Button className="shadow-md shadow-primary/10">
                <BadgePlus strokeWidth={IconButtonConfig.strokeWidth} />
                Nuevo equipo
              </Button>
            }
          />
        </div>
      </div>

      {equipos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/20 p-12 text-center backdrop-blur-sm min-h-[300px]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No hay equipos registrados</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Comienza agregando un equipo al sistema para organizar a tus luchadores.
          </p>
          <ModalEquipo
            trigger={
              <Button className="mt-6 shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Crear primer equipo
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {equipos.map((equipo) => (
            <CardEquipo
              key={equipo.id}
              id={equipo.id}
              nombre={equipo.nombre}
              pais={equipo.pais}
              ciudad={equipo.ciudad}
              luchadoresCount={equipo._count?.luchadores ?? 0}
            />
          ))}
        </div>
      )}
    </main>
  );
}

