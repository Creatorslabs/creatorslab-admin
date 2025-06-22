"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SidebarProvider } from "./ui/sidebar";
import { useConfirm } from "@/hooks/useConfirm";
import { ErrorBoundary } from "./error-boundary";
import { Toaster } from "./ui/sonner";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const { ConfirmModal } = useConfirm();
  return (
    <SessionProvider>
      <ErrorBoundary>
        <SidebarProvider>
          {children}
          <ConfirmModal />
          <Toaster position="bottom-right" />
        </SidebarProvider>
      </ErrorBoundary>
    </SessionProvider>
  );
}
