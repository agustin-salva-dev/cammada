import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import type { Metadata } from "next";

import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Panel de control - Cammada",
  description: "Gestiona eventos, luchadores y combates de Cammada.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SidebarProvider>
      <AdminSidebar user={session?.user} />
      <div className="flex-1 min-w-0 p-5 pt-3">
        <DashboardHeader />
        {children}
      </div>
    </SidebarProvider>
  );
}
