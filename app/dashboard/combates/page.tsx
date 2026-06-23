import { getCombates } from "@/features/combates/actions";
import { getLuchadoresSelect } from "@/features/luchadores/actions";
import { getEventos } from "@/features/eventos/actions";
import { getCategoriasPesoSelect } from "@/features/categorias-peso/actions";
import { getModalidadesSelect } from "@/features/modalidades/actions";
import { CombatesClient } from "@/features/combates/components/CombatesClient";
import type { CombateCompleto } from "@/features/combates/components/CombatesClient";

export default async function CombatesPage() {
  const [
    combatesResult,
    luchadoresResult,
    eventosResult,
    categoriasResult,
    modalidadesResult,
  ] = await Promise.all([
    getCombates(),
    getLuchadoresSelect(),
    getEventos(),
    getCategoriasPesoSelect(),
    getModalidadesSelect(),
  ]);

  const combates = (
    combatesResult.success && combatesResult.data ? combatesResult.data : []
  ) as CombateCompleto[];

  const luchadores =
    luchadoresResult.success && luchadoresResult.data
      ? luchadoresResult.data
      : [];

  const eventos =
    eventosResult.success && eventosResult.data
      ? eventosResult.data.map((e) => ({ id: e.id, numero: e.numero }))
      : [];

  const categorias =
    categoriasResult.success && categoriasResult.data
      ? categoriasResult.data
      : [];

  const modalidades =
    modalidadesResult.success && modalidadesResult.data
      ? modalidadesResult.data
      : [];

  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Combates</h1>
          <p className="text-sm text-muted-foreground">
            Creá y gestioná los combates de cada evento.
          </p>
        </div>
      </div>

      <CombatesClient
        combates={combates}
        luchadores={luchadores}
        eventos={eventos}
        categorias={categorias}
        modalidades={modalidades}
      />
    </main>
  );
}
