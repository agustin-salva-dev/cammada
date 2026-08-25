import { getExportadosDashboard } from "@/features/luchadores/actions/exportados";
import { ExportadosDashboardManager } from "@/features/luchadores/components/exportados/dashboard/ExportadosDashboardManager";
import { hasPermission } from "@/lib/action-guard";
import { PERMISSIONS } from "@/constants/permissions";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Talento Exportado - Panel de control",
  description:
    "Administrá y reordená los peleadores destacados exportados a promociones nacionales e internacionales.",
};

export default async function ExportadosDashboardPage() {
  const [result, canManage] = await Promise.all([
    getExportadosDashboard(),
    hasPermission(PERMISSIONS.EXPORTADOS.GESTIONAR),
  ]);

  const exportados = result.success && result.data ? result.data : [];

  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Talento Exportado</h1>
        <p className="text-sm text-muted-foreground">
          Gestioná y defini el orden de aparición de los peleadores impulsados
          desde Cammada hacia ligas de mayor envergadura.
        </p>
      </div>

      <ExportadosDashboardManager
        initialExportados={exportados}
        canManage={canManage}
      />
    </main>
  );
}
