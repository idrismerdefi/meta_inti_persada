import { defineConfig } from "drizzle-kit";

// Dipakai untuk `npm run db:push` / `db:studio` terhadap Postgres produksi.
// Untuk development lokal tanpa DATABASE_URL, tabel dibuat otomatis di PGlite (lihat src/db/index.ts).
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
