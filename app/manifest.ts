// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MeorFitnessApp",
    short_name: "MeorFP",
    description: "MeorFitnessApp is cool.",
    start_url: "/",
    display: "standalone", // This is what removes the Safari bars!
    background_color: "#ffffff",
    theme_color: "#000000",
    // icons: [
    //   {
    //     src: "/icon-192x192.png",
    //     sizes: "192x192",
    //     type: "image/png",
    //   },
    //   {
    //     src: "/icon-512x512.png",
    //     sizes: "512x512",
    //     type: "image/png",
    //   },
    // ],
  };
}
