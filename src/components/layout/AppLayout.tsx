"use client";

import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { SidebarLayout } from "./SidebarLayout";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;

  return (
    <div className="flex h-screen w-full">
      <SidebarLayout />
      <main
        className={cn(
          "flex-1 h-full overflow-auto bg-card transition-[margin-left] ease-in-out duration-300 pt-8 pb-8 px-4 sm:px-8",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
        )}
      >
        {children}
      </main>
    </div>
  );
}
