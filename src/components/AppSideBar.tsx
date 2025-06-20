"use client";

import React, { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  LayoutDashboard,
  Users,
  ListTodo,
  Activity,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils"; // optional utility function for merging classes

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const AppSideBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Auto-collapse on small screens
    const media = window.matchMedia("(max-width: 768px)");
    setIsCollapsed(media.matches);

    const handler = (e: MediaQueryListEvent) => setIsCollapsed(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const menuItems: NavItem[] = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/admin/tasks",
      label: "Tasks",
      icon: <ListTodo className="h-5 w-5" />,
    },
    {
      href: "/admin/engagement",
      label: "Engagement",
      icon: <Activity className="h-5 w-5" />,
    },
  ];

  return (
    <Sidebar
      className="bg-card text-white w-64 min-h-screen transition-all duration-300"
      collapsible="icon"
    >
      <SidebarHeader className="p-4 px-6">
        <Link href="/" className="flex flex-row gap-2 items-center my-10">
          <Image
            src="/images/logo.png"
            width={35}
            height={35}
            alt="CreatorsLab logo"
          />
          <p className={`text-lg ${isCollapsed ? "hidden md:block" : "block"}`}>
            Creatorslab
          </p>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "flex items-center gap-3 px-4 py-6 rounded-xl transition-colors",
                        {
                          "bg-card/10 text-white": isActive,
                          "hover:bg-white/5": !isActive,
                          "justify-center": isCollapsed,
                        }
                      )}
                    >
                      <button onClick={() => router.push(item.href)}>
                        {item.icon}
                        {!isCollapsed && <span>{item.label}</span>}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "flex items-center gap-3 px-4 py-6 text-white hover:bg-white/5 rounded-xl transition-colors mb-8",
                { "justify-center": isCollapsed }
              )}
            >
              <button onClick={() => router.push("/login")}>
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSideBar;
