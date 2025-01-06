import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 w-full">
          <div className="sticky z-10 border-b w-full bg-gray-50">
            <SidebarTrigger />
          </div>
          <div className="h-full w-full p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
