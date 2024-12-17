"use client";

import { Folders, LayoutTemplate, Settings } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useUser,
} from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Projects",
    url: "/projects",
    icon: Folders,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: LayoutTemplate,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>AI Marketing Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="px-4 py-2 pb-6">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            {state === "expanded" && user && (
              <span className="text-sm text-sidebar-foreground truncate">
                {user.fullName ||
                  user.username ||
                  user.primaryEmailAddress?.emailAddress}
              </span>
            )}
          </div>
        </SignedIn>
      </div>
    </Sidebar>
  );
}
