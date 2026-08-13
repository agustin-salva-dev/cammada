import type { Metadata } from "next";
import { requirePermission } from "@/lib/action-guard";
import { PERMISSIONS } from "@/constants/permissions";
import { getOpinionesDashboard, getEstadisticasModeracion } from "@/features/opiniones/queries";
import { ModeracionPanel } from "@/features/opiniones/components/admin/ModeracionPanel";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Moderación de Opiniones - Dashboard Cammada",
  description: "Revisá, aprobá y respondé las opiniones y feedback de la comunidad.",
};

export default async function DashboardOpinionesPage() {
  try {
    await requirePermission(PERMISSIONS.OPINIONES.VER);
  } catch {
    redirect("/dashboard");
  }

  const [opiniones, estadisticas] = await Promise.all([
    getOpinionesDashboard(),
    getEstadisticasModeracion(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Moderación de Opiniones</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Revisá las opiniones de la comunidad antes de publicarlas, y respondé en nombre de la organización.
        </p>
      </div>

      <ModeracionPanel opiniones={opiniones} estadisticas={estadisticas} />
    </div>
  );
}
