import "server-only";
import * as schema from "./schema";
import { BOOTSTRAP_SQL } from "./schema";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

// PGlite & node-postgres memakai query builder Postgres yang sama; disatukan ke satu tipe
// supaya pemanggil tidak berurusan dengan union type.
export type Database = NodePgDatabase<typeof schema>;

/**
 * Satu koneksi per proses.
 * - DATABASE_URL terisi  → Postgres sungguhan (node-postgres), untuk produksi.
 * - DATABASE_URL kosong  → PGlite (Postgres dalam WASM) tersimpan di ./.data, untuk development.
 * Keduanya dialek Postgres, jadi query & schema identik.
 */
const globalForDb = globalThis as unknown as { __mipDb?: Promise<Database> };

async function connect(): Promise<Database> {
  const url = process.env.DATABASE_URL?.trim();

  if (url) {
    const { default: pg } = await import("pg");
    const { drizzle } = await import("drizzle-orm/node-postgres");
    // SSL diatur lewat connection string (mis. ?sslmode=require pada Neon/Supabase).
    const pool = new pg.Pool({ connectionString: url, max: 5 });
    await pool.query(BOOTSTRAP_SQL);
    return drizzle(pool, { schema });
  }

  const { mkdirSync } = await import("node:fs");
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  mkdirSync("./.data", { recursive: true });
  const client = new PGlite("./.data/pglite");
  await client.exec(BOOTSTRAP_SQL);
  return drizzle(client, { schema }) as unknown as Database;
}

export function getDb(): Promise<Database> {
  if (!globalForDb.__mipDb) {
    globalForDb.__mipDb = connect().catch((err) => {
      globalForDb.__mipDb = undefined;
      throw err;
    });
  }
  return globalForDb.__mipDb;
}

export { schema };
