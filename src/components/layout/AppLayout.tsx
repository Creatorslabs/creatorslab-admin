"use client";

import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { SidebarLayout } from "./SidebarLayout";
import { AdminNavbar } from "../NavBar";
import { getMenuList } from "@/lib/menulist";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sidebar = useStore(useSidebar, (x) => x);
  const { data: session } = useSession();

  const role = session?.user?.role;

  if (!sidebar) return null;
  if (!role) return <div className="w-full">{children}</div>;

  const { getOpenState, settings } = sidebar;

  const allowedPaths = getMenuList(role).map((item) => item.href);
  const shouldRenderLayout = allowedPaths.includes(pathname);

  if (!shouldRenderLayout) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div className="flex h-screen w-full">
      <SidebarLayout />
      <main
        className={cn(
          "flex-1 h-full overflow-auto bg-background transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
        )}
      >
        <AdminNavbar />
        <div className="pt-7 md:pt-16 px-4 md:px-6">{children}</div>
      </main>
    </div>
  );
}
