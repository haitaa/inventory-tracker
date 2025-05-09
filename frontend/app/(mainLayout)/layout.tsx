import type { Metadata } from "next";
import { AuthProvider } from "@/app/lib/auth";
import React from "react";
import "@/app/globals.css";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import ClientAIChatWidget from "@/components/ClientAIChatWidget";

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
    <html lang="en" className="overflow-hidden">
      <body className="overflow-hidden">
        <AuthProvider>
          <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Topbar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
            {/* AI Chat Widget */}
            <ClientAIChatWidget />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
