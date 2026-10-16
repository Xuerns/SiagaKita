import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { IosInstallPromptModal } from "@/components/pwa/IosInstallPromptModal";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export const metadata: Metadata = {
  title: "SiagaKita — Kesiapsiagaan Bencana & Peta Evakuasi",
  description: "Platform PWA kesiapsiagaan bencana hiperlokal, peta evakuasi offline, dan laporan warga terverifikasi.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SiagaKita",
  },
};

export const viewport: Viewport = {
  themeColor: "#176B4D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ServiceWorkerRegister />
        <IosInstallPromptModal />
        <TooltipProvider>
          <AuthProvider>{children}</AuthProvider>
        </TooltipProvider>
      </body>

    </html>
  );
}

