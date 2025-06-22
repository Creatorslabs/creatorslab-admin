"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { User2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UserNav } from "./user-nav";
import { SheetMenu } from "./sheet-menu";

export function AdminNavbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasSearch = searchParams?.get("search");
    if (hasSearch) {
      const url = new URL(window.location.href);
      url.searchParams.delete("search");
      router.replace(url.pathname);
    }
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`${pathname}?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-10 w-full flex items-center justify-between px-4 md:px-6 h-14 md:h-16",

        // Mobile styles: keep shadow and background effects
        "shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/95 border-b border-border",

        // Desktop (lg and up): remove shadows and borders, add padding top
        "backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/95 lg:shadow-none lg:dark:shadow-none lg:border-none lg:backdrop-blur-0 lg:bg-transparent lg:pt-16"
      )}
    >
      <h1 className="hidden md:block text-foreground font-semibold text-sm md:text-base">
        {getTitleFromPath(pathname)}
      </h1>

      <SheetMenu />

      <form onSubmit={handleSearch} className="relative w-1/2 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
        <Input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-3 py-2 bg-card border border-white/10 text-sm text-foreground placeholder-white/40 rounded-md focus:outline-none focus:ring-0 focus:border-white/20"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <UserNav />
    </header>
  );
}

function getTitleFromPath(path: string) {
  const routes: Record<string, string> = {
    "/": "Dashboard",
    "/task": "Tasks",
    "/users": "Users",
    "/engagement": "Engagement",
  };

  return routes[path] || "Page";
}
