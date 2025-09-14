import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_CONFIG } from "@/lib/constants";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastNotifications } from "@/components/notifications/ToastNotifications";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
  keywords: ["import duty", "VAT refund", "HMRC", "courier", "UK customs"],
  authors: [{ name: "Dutyback Helper" }],
  openGraph: {
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <ToastNotifications />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
