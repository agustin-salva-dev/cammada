import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTriggerContainer } from "@/components/ui/SidebarTriggerContainer";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex-1 flex min-w-0">
        <SidebarTriggerContainer />
        <div className="flex-1 min-w-0 p-5 pt-3">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
