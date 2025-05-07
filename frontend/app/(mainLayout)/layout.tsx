import type { Metadata } from "next";
import { AuthProvider } from "@/app/lib/auth";
import React from "react";
import "@/app/globals.css";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

export const metadata: Metadata = {
  title: "Envanter ve Müşteri Yönetim Sistemi",
  description: "Müşteri ve sipariş yönetimi için geliştirilmiş uygulama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <AuthProvider>
          <div className="flex h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Topbar />
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
