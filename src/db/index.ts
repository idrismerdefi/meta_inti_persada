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
    // Koneksi SSL dengan verifikasi sertifikat penuh. Rantai sertifikat Supabase tidak ada di
    // daftar CA bawaan Node, jadi root CA-nya ditambahkan di samping CA publik yang sudah ada.
    // sslmode di URL dibuang supaya tidak menimpa opsi ssl di bawah.
    const { rootCertificates } = await import("node:tls");
    const { SUPABASE_ROOT_CA } = await import("./supabase-ca");
    const u = new URL(url);
    u.searchParams.delete("sslmode");
    const pool = new pg.Pool({
      connectionString: u.toString(),
      max: 5,
      ssl: { ca: [...rootCertificates, SUPABASE_ROOT_CA], rejectUnauthorized: true },
    });
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
