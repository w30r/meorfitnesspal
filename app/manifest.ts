// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MeorFitnessPal",
    short_name: "MFP",
    description: "Track your calories with heatmaps and streaks.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f2f2", // Matches your --background
    theme_color: "#9b4dff", // Matches your --primary
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable", // Allows Android to shape the icon
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
