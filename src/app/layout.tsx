import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Come Come | Pedido online",
  description:
    "Pide completos, churrascos, empanadas y combos para retirar en local.",
};

export const viewport: Viewport = {
  themeColor: "#d71920",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CL">
      <body className="min-h-screen bg-white text-dark">{children}</body>
    </html>
  );
}
