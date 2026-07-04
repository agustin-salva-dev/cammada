import { BadgePlus, Trophy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButtonConfig } from "@/constants/ui";
import { getRankings } from "@/features/rankings/actions";
import { getLuchadoresSelect } from "@/features/luchadores/actions";
import { getModalidadesSelect } from "@/features/modalidades/actions";
import { getCategoriasPesoSelect } from "@/features/categorias-peso/actions";
import { CardRanking } from "@/features/rankings/components/CardRanking";
import { ModalRanking } from "@/features/rankings/components/ModalRanking";

export default async function RankingsPage() {
  const [
    rankingsResult,
    luchadoresResult,
    modalidadesResult,
    categoriasResult,
  ] = await Promise.all([
    getRankings(),
    getLuchadoresSelect(),
    getModalidadesSelect(),
    getCategoriasPesoSelect(),
  ]);

  const rankings =
    rankingsResult.success && rankingsResult.data ? rankingsResult.data : [];
  const luchadores =
    luchadoresResult.success && luchadoresResult.data
      ? luchadoresResult.data.map((l) => ({
          ...l,
          equipo: l.equipo || { nombre: "Sin equipo" },
        }))
      : [];
  const modalidades =
    modalidadesResult.success && modalidadesResult.data
      ? modalidadesResult.data
      : [];
  const categoriasPeso =
    categoriasResult.success && categoriasResult.data
      ? categoriasResult.data
      : [];

  const triggerButton = (
    <Button className="shadow-md shadow-primary/10">
      <BadgePlus strokeWidth={IconButtonConfig.strokeWidth} />
      Nuevo ranking
    </Button>
  );

  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rankings</h1>
          <p className="text-sm text-muted-foreground">
            Gestioná los rankings por categoría y modalidad, incluyendo el P4P
            (Libra por Libra).
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <ModalRanking
            trigger={triggerButton}
            luchadores={luchadores}
            modalidades={modalidades}
            categoriasPeso={categoriasPeso}
          />
        </div>
      </div>

      {rankings.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/20 p-12 text-center backdrop-blur-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Trophy className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No hay rankings registrados
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Creá el primer ranking para comenzar a clasificar a los peleadores
            por categoría y modalidad.
          </p>
          <ModalRanking
            trigger={
              <Button className="mt-6 shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Crear primer ranking
              </Button>
            }
            luchadores={luchadores}
            modalidades={modalidades}
            categoriasPeso={categoriasPeso}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rankings.map((ranking) => (
            <CardRanking
              key={ranking.id}
              id={ranking.id}
              modalidadId={ranking.modalidadId}
              modalidad={ranking.modalidad.nombre}
              categoriaPesoId={ranking.categoriaPesoId}
              categoriaPeso={ranking.categoriaPeso?.nombre ?? null}
              campeonId={ranking.campeonId}
              campeon={
                ranking.campeon
                  ? {
                      id: ranking.campeon.id,
                      nombre: ranking.campeon.nombre,
                      apellido: ranking.campeon.apellido,
                      apodo: ranking.campeon.apodo,
                      equipo: ranking.campeon.equipo || { nombre: "Sin equipo" },
                    }
                  : null
              }
              items={ranking.items.map((item) => ({
                id: item.id,
                posicion: item.posicion,
                luchador: {
                  id: item.luchador.id,
                  nombre: item.luchador.nombre,
                  apellido: item.luchador.apellido,
                  apodo: item.luchador.apodo,
                  pais: item.luchador.pais,
                  categoria: item.luchador.categoria,
                  equipo: item.luchador.equipo || { nombre: "Sin equipo" },
                },
              }))}
              totalItems={ranking.totalItems}
              luchadores={luchadores}
              modalidades={modalidades}
              categoriasPeso={categoriasPeso}
            />
          ))}
        </div>
      )}
    </main>
  );
}
