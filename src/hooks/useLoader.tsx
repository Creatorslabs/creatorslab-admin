"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LoaderOptions {
  message?: string;
}

export function useLoader() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Please wait...");

  const showLoader = (options?: LoaderOptions) => {
    setMessage(options?.message || "Please wait...");
    setIsOpen(true);
  };

  const hideLoader = () => {
    setIsOpen(false);
  };

  const LoaderModal = () => (
    <Dialog open={isOpen}>
      <DialogDescription className="sr-only" />
      <DialogContent className="bg-card-box border-border text-foreground flex flex-col items-center justify-center py-10 max-w-xs gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </DialogContent>
    </Dialog>
  );

  return { showLoader, hideLoader, LoaderModal };
}
