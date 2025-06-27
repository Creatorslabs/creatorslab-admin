"use client";

import Link from "next/link";
import { MenuIcon, PanelsTopLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "./menu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";

export function SheetMenu() {
  const pathname = usePathname();

  return (
    <Sheet aria-describedby="navbar">
      <SheetDescription className="sr-only" />
      <DialogTitle className="sr-only">Mobile Navigation Menu</DialogTitle>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="sm:w-72 px-3 h-full flex flex-col bg-card"
        side="left"
      >
        <SheetHeader>
          <Link
            href="/"
            className="flex items-center gap-2 p-4 px-6 text-foreground no-underline my-5"
          >
            <Image
              src="/images/logo.png"
              width={30}
              height={30}
              alt="CreatorsLab logo"
            />
            <h1 className={cn("font-bold text-xl")}>Creatorlab</h1>
          </Link>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
