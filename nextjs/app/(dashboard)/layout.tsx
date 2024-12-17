// layout.tsx

import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SidebarProvider>
        <Sidebar />
        {children}
      </SidebarProvider>
    </div>
  );
}
