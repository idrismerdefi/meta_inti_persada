import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite (Postgres-in-WASM untuk development lokal) harus dimuat apa adanya oleh Node.
  serverExternalPackages: ["@electric-sql/pglite"],
  poweredByHeader: false,
  images: { qualities: [75, 95] },
};

export default nextConfig;
