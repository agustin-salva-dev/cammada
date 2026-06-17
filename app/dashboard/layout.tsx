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
      <div className="w-full flex">
        <SidebarTriggerContainer />
        <div className="w-full p-5 pt-3">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
