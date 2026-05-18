import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Punto Mordida | Pedido online",
  description:
    "Pide completos, churrascos, empanadas y combos para retirar en local.",
};

export const viewport: Viewport = {
  themeColor: "#d71920",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CL">
      <body className="min-h-screen bg-white text-dark">
        <SiteSettingsProvider>{children}</SiteSettingsProvider>
      </body>
    </html>
  );
}
