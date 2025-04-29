import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import MainNav from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChatProvider } from "@/components/chat-provider";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import ChatButton from "@/components/chat-button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Gestión de Proveedores",
  description: "Sistema de gestión y seguimiento de proveedores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-[#1C1C1F]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SupabaseProvider>
            <ChatProvider>
              <div className="flex min-h-screen flex-col main-container overflow-x-hidden">
                <header className="sticky top-0 z-50 w-full border-b border-[#2A2A2E] bg-[#1C1C1F]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1C1C1F]/60">
                  <div className="container flex h-14 items-center px-4">
                    <MainNav />
                    <div className="flex flex-1 items-center justify-end space-x-2">
                      <ChatButton />
                      <ThemeToggle />
                    </div>
                  </div>
                </header>
                <main className="flex-1 text-white">{children}</main>
              </div>
            </ChatProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
