import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import type { Viewport } from "next";
import BottomNav from "@/components/BottomNav";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Fixes white gaps around the notch
};

// export const metadata = {
//   title: "MeorFitnessPal",
//   // ... other metadata
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: "default",
//     title: "MeorFP",
//     // startupImage: [], // Optional: add splash screens here
//   },
//   icons: {
//     apple: "/icon-512x512.png", // This makes it look right on iPhones
//   },
// };

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
    statusBarStyle: "default",
    title: "MeorFP",
    // startupImage: [], // Optional: add splash screens here
  },
  icons: {
    apple: "/icon-512x512.png", // This makes it look right on iPhones
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
      <body className="min-h-full flex flex-col pb-16">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
