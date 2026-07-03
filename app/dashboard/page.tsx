import {
  getDashboardData,
  getEventosDropdownList,
} from "@/features/dashboard/actions";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";

export default async function Dashboard() {
  const [dashboardResult, eventosResult] = await Promise.all([
    getDashboardData(),
    getEventosDropdownList(),
  ]);

  if (!dashboardResult.success || !eventosResult.success) {
    return (
      <main className="w-full px-5 py-3">
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">No hay eventos disponibles</p>
          <p className="text-sm mt-1">
            Crea tu primer evento para ver las estadísticas del dashboard.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full py-3">
      <DashboardOverview
        initialData={dashboardResult.data}
        eventosLista={eventosResult.data}
      />
    </main>
  );
}
