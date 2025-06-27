"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import Image from "next/image";

export function UserNav() {
  const { data: session } = useSession();
  const user = session?.user;
  const imageUrl = user?.image || "https://i.pravatar.cc/100";

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div className="relative h-8 w-8 rounded-full overflow-hidden">
            <Avatar className="h-8 w-8">
              <AvatarImage src={imageUrl} alt="User Avatar" />
              <AvatarFallback className="bg-transparent">
                <Image
                  width={25}
                  height={25}
                  src="https://i.pravatar.cc/100"
                  alt="Fallback Avatar"
                  quality={75}
                  loader={({ src, width, quality }) =>
                    `${src}?w=${width}&q=${quality || 75}`
                  }
                />
              </AvatarFallback>
            </Avatar>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-card text-foreground">
          {user?.name || "Profile"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
