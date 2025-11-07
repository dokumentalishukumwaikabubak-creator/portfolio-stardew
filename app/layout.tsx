import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageContext";

export const metadata: Metadata = {
  title: "Tiko Cyberspace",
  description: "Personal Website Tiko Aprilianto",
  // Next.js will automatically use app/icon.png or public/icon.png
  // No need to specify in metadata if using standard location
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): any {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen flex flex-col">
        <LanguageProvider>
          <Navigation />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
