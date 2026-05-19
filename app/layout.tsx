import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import type { Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import { AuthProvider } from "@/components/AuthProvider";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "MeorFP",
  description: "Meor Fitness Pal",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MeorFP",
  },
  icons: {
    apple: "/icon-512x512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", "dark")}>
      <body className="min-h-full flex flex-col pb-16 font-sans">
        <AuthProvider>{children}</AuthProvider>
        <BottomNav />
      </body>
    </html>
  );
}
