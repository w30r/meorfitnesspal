import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Fixes white gaps around the notch
};

// export const metadata = {
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: 'black-translucent', // Makes the status bar float over your content
//     title: 'My Awesome App',
//   },
// }

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeorFP",
  description: "meorFitnessPal",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // Makes the status bar float over your content
    title: "MeorFP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-mono",
        inter.variable,
        "dark",
      )}
    >
      <body className="min-h-full flex flex-col">
        <header className="text-xl font-bold mb-8 text-foreground text-center mt-12">
          MeorFitnessPal
        </header>
        {children}
      </body>
    </html>
  );
}
