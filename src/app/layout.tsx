import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Come Come - Pedido Online",
  description: "Pide tus favoritos en minutos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-dark">
        {children}
      </body>
    </html>
  );
}
