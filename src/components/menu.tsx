"use client";

import Link from "next/link";
import { LogOut, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { getMenuList } from "@/lib/menulist";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuList, setMenuList] = useState<MenuItem[]>([]);

  useEffect(() => {
    const role = session?.user?.role;
    if (role) {
      const menuList: MenuItem[] = getMenuList(role);
      setMenuList(menuList);
    }
  }, [session?.user?.role]);

  return (
    <nav className="flex flex-col h-full w-full mt-8">
      <ul className="flex flex-col flex-grow items-start space-y-4 px-2">
        {menuList.map(({ href, label, icon: Icon }: MenuItem) => {
          const isActive = pathname === href;
          return (
            <li className="w-full" key={href}>
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      className={cn(
                        "w-full justify-start h-10 mb-1 px-4 py-6 rounded-lg bg-transparent border-none text-foreground hover:bg-white/10 shadow-none",
                        {
                          "bg-white/10 text-foreground": isActive,
                          "hover:bg-white/5": !isActive,
                        }
                      )}
                      asChild
                    >
                      <Link href={href}>
                        <span className={cn(isOpen === false ? "" : "mr-4")}>
                          <Icon size={18} />
                        </span>
                        <p
                          className={cn(
                            "max-w-[200px] truncate",
                            isOpen === false
                              ? "-translate-x-96 opacity-0"
                              : "translate-x-0 opacity-100"
                          )}
                        >
                          {label}
                        </p>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  {isOpen === false && (
                    <TooltipContent
                      side="right"
                      className="bg-card text-foreground"
                    >
                      {label}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </li>
          );
        })}
        <li className="w-full grow flex items-end">
          <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => signOut()}
                  className="w-full justify-center h-10 mt-5 px-4 py-6 rounded-lg bg-card/10 hover:bg-white/5 text-foreground shadow-none"
                >
                  <span className={cn(isOpen === false ? "" : "mr-4")}>
                    <LogOut size={18} />
                  </span>
                  <p
                    className={cn(
                      "whitespace-nowrap",
                      isOpen === false ? "opacity-0 hidden" : "opacity-100"
                    )}
                  >
                    Logout
                  </p>
                </Button>
              </TooltipTrigger>
              {isOpen === false && (
                <TooltipContent
                  side="right"
                  className="bg-card text-foreground"
                >
                  Logout
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </li>
      </ul>
    </nav>
  );
}
