import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/action-guard";
import { PERMISSIONS } from "@/constants/permissions";
import { getEventosDashboardPredicciones } from "@/features/predicciones/queries";
import { PrediccionesAdminClient } from "@/features/predicciones/components/admin/PrediccionesAdminClient";

export const metadata: Metadata = {
  title: "Gestión de Predicciones - Dashboard Cammada",
  description:
    "Configurá qué combates de la cartelera tienen habilitadas las predicciones de la comunidad.",
};

export default async function DashboardPrediccionesPage() {
  try {
    await requirePermission(PERMISSIONS.PREDICCIONES.VER);
  } catch {
    redirect("/dashboard");
  }

  const eventos = await getEventosDashboardPredicciones();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestión de Predicciones</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Habilitá o pausá las predicciones públicas de los combates de cada
          evento (máximo 10 de la cartelera principal).
        </p>
      </div>

      <PrediccionesAdminClient eventos={eventos} />
    </div>
  );
}
