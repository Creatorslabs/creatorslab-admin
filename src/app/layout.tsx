import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

// Load Inter Variable Font Locally
const inter = localFont({
  src: "fonts/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter",
  display: "swap",
});

// Load Syne Variable Font Locally
const syne = localFont({
  src: "fonts/Syne-VariableFont_wght.ttf",
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin - Empowering Global Creativity with Web3",
  description:
    "Join the movement to enable creators worldwide to grow, engage, and earn. Built on the lightning-fast, low-fee Solana blockchain, backed by Solana Foundation and SuperteamNG.",
  keywords: [
    "Admin",
    "admin tools",
    "digital tools",
    "content monetization",
    "web3 platform",
    "NFT tools",
    "AI utilities",
    "marketing tools",
    "growth automation",
    "membership tools",
    "subscription services",
    "passive income tools",
    "crypto integrations",
    "no-code solutions",
    "automation platforms",
    "digital marketing stack",
    "monetization platforms",
    "best admin tools",
    "admin dashboard",
  ],
  openGraph: {
    title: "Admin - Empowering Global Creativity with Web3",
    description:
      "Join the movement to enable creators worldwide to grow, engage, and earn. Built on the lightning-fast, low-fee Solana blockchain, backed by Solana Foundation and SuperteamNG.",
    url: "https://creatorslab.cc/",
    type: "website",
    images: [
      {
        url: "/images/1500x500.jpeg",
        width: 1200,
        height: 630,
        alt: "Admin - Empowering Global Creativity with Web3",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@adminhandle",
    title: "Admin - Empowering Global Creativity with Web3",
    description:
      "Join the movement to enable creators worldwide to grow, engage, and earn. Built on the lightning-fast, low-fee Solana blockchain, backed by Solana Foundation and SuperteamNG.",
    images: ["/images/1500x500.jpeg"],
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Admin",
    url: "https://creatorslab.cc",
    logo: "https://creatorslab.cc/logo.png",
    description:
      "Admin provides AI-powered tools and monetization solutions for digital teams and platform managers.",
    sameAs: [
      "https://twitter.com/adminhandle",
      "https://www.linkedin.com/company/admin",
      "https://www.instagram.com/admin",
      "https://www.facebook.com/admin",
      "https://www.tiktok.com/@admin",
      "https://www.youtube.com/@admin",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} ${syne.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
