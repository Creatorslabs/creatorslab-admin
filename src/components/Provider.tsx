"use client";

import { LoaderProvider } from "@/hooks/usePageLoader";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SidebarProvider } from "./ui/sidebar";
import { useConfirm } from "@/hooks/useConfirm";
import { ErrorBoundary } from "./error-boundary";

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
        </SidebarProvider>
      </ErrorBoundary>
    </SessionProvider>
  );
}
