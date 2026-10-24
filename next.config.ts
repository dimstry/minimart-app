import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [{ source: "/laporan", destination: "/laporan/penjualan", permanent: false }],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
