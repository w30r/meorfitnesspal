import type { NextConfig } from "next";
import createPWAConfig from "@ducanh2912/next-pwa";

const pwaConfig = createPWAConfig({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/meorfitnesspal\.vercel\.app\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "offline-runtime",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const nextConfig: NextConfig = {
  ...pwaConfig,
  allowedDevOrigins: ["914e-180-74-71-109.ngrok-free.app"],
};

export default nextConfig;