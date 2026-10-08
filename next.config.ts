import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite (Postgres-in-WASM untuk development lokal) harus dimuat apa adanya oleh Node.
  serverExternalPackages: ["@electric-sql/pglite"],
  poweredByHeader: false,
};

export default nextConfig;
