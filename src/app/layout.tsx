import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Benguela Tickets | Ingressos Online",
  description: "Compre ingressos para os melhores eventos de Benguela. Rápido, seguro e com QR Code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
