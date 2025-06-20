import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppLayout from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Admin - Empowering Global Creativity with Web3",
  description:
    "Join the movement to enable creators worldwide to grow, engage, and earn. Built on the lightning-fast, low-fee Solana blockchain, backed by Solana Foundation and SuperteamNG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`antialiased bg-background text-foreground min-h-screen flex w-full`}
      >
        <SidebarProvider>
          <AppLayout>{children}</AppLayout>
        </SidebarProvider>
      </body>
    </html>
  );
}
