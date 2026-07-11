import { Button } from "@/components/ui/button";
import { BadgePlus, Download, Swords, Plus } from "lucide-react";
import { IconButtonConfig } from "@/constants/ui";
import { getEventos } from "@/features/eventos/actions";
import { CardEvento } from "@/features/eventos/components/CardEvento";
import { ModalEvento } from "@/features/eventos/components/ModalEvento";
import type { EstadoEvento } from "@/features/eventos/zod";
import { hasPermission } from "@/lib/action-guard";
import { PERMISSIONS } from "@/constants/permissions";

export default async function Eventos() {
  const [result, canCreate] = await Promise.all([
    getEventos(),
    hasPermission(PERMISSIONS.EVENTOS.CREAR),
  ]);
  const eventos = result.success && result.data ? result.data : [];

  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Eventos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona todos los eventos y sus carteleras de peleas.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            className="border-border/50 hover:bg-muted/50"
          >
            <Download strokeWidth={IconButtonConfig.strokeWidth} />
            Exportar eventos
          </Button>
          {canCreate && (
            <ModalEvento
              trigger={
                <Button className="shadow-md shadow-primary/10">
                  <BadgePlus strokeWidth={IconButtonConfig.strokeWidth} />
                  Nuevo evento
                </Button>
              }
            />
          )}
        </div>
      </div>

      {eventos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/20 p-12 text-center backdrop-blur-sm min-h-[300px]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Swords className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No hay eventos registrados
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Comienza creando tu primer evento para organizar las carteleras de
            peleas.
          </p>
          {canCreate && (
            <ModalEvento
              trigger={
                <Button className="mt-6 shadow-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primer evento
                </Button>
              }
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {eventos.map((evento) => (
            <CardEvento
              key={evento.id}
              id={evento.id}
              numero={evento.numero}
              fecha={
                evento.fecha instanceof Date
                  ? evento.fecha.toISOString().split("T")[0]
                  : String(evento.fecha).split("T")[0]
              }
              horaInicio={evento.horaInicio}
              horaFin={evento.horaFin}
              lugarNombre={evento.lugarNombre}
              calle={evento.calle}
              calleNumero={evento.calleNumero}
              estado={evento.estado as EstadoEvento}
              peleasCount={evento._count?.combates ?? 0}
              combates={evento.combates}
            />
          ))}
        </div>
      )}
    </main>
  );
}
