import { Button } from "@/components/ui/button";
import { BadgePlus, Medal, Plus } from "lucide-react";
import { IconButtonConfig } from "@/components/layout/DashboardHeader";
import { getModalidades } from "@/features/modalidades/actions";
import { CardModalidad } from "@/features/modalidades/components/CardModalidad";
import { ModalModalidad } from "@/features/modalidades/components/ModalModalidad";

interface ModalidadOption {
  id: string;
  nombre: string;
  _count?: {
    records: number;
  };
}

export default async function ModalidadesPage() {
  const result = await getModalidades();
  const modalidades: ModalidadOption[] =
    result.success && result.data ? result.data : [];

  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Modalidades de Combate
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las modalidades de combate disponibles para los
            luchadores y sus records.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <ModalModalidad
            trigger={
              <Button className="shadow-md shadow-primary/10">
                <BadgePlus strokeWidth={IconButtonConfig.strokeWidth} />
                Nueva modalidad
              </Button>
            }
          />
        </div>
      </div>

      {modalidades.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/20 p-12 text-center backdrop-blur-sm min-h-[300px]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Medal className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No hay modalidades registradas
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Comienza agregando una modalidad de combate para clasificar los
            records de los luchadores.
          </p>
          <ModalModalidad
            trigger={
              <Button className="mt-6 shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Crear primera modalidad
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modalidades.map((modalidad) => (
            <CardModalidad
              key={modalidad.id}
              id={modalidad.id}
              nombre={modalidad.nombre}
              recordsCount={modalidad._count?.records ?? 0}
            />
          ))}
        </div>
      )}
    </main>
  );
}
