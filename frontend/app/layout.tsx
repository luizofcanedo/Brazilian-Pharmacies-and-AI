import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "SMB Market Intelligence - Dashboard",
  description: "Dark-mode dashboard for SMB Market Intelligence in Brazil"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}

