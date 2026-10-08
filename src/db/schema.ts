import { customType, integer, jsonb, pgTable, serial, text, timestamp, date } from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer | Uint8Array }>({
  dataType: () => "bytea",
  toDriver: (v) => v,
  fromDriver: (v) => Buffer.from(v),
});

export type RfqItem = { description: string; qty: string; unit: string };

export const RFQ_STATUSES = ["baru", "diproses", "penawaran-dikirim", "selesai", "batal"] as const;
export type RfqStatus = (typeof RFQ_STATUSES)[number];

export const rfqRequests = pgTable("rfq_requests", {
  id: serial("id").primaryKey(),
  refCode: text("ref_code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  position: text("position"),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  sector: text("sector").notNull(),
  categories: jsonb("categories").$type<string[]>().notNull().default([]),
  items: jsonb("items").$type<RfqItem[]>().notNull().default([]),
  deliveryLocation: text("delivery_location"),
  neededBy: date("needed_by"),
  notes: text("notes"),
  status: text("status").$type<RfqStatus>().notNull().default("baru"),
});

/** Konten website yang diedit dari panel admin; satu baris per bagian (key). */
export const cmsContent = pgTable("cms_content", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<unknown>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Gambar unggahan dari CMS; disimpan di database agar ikut jalan di hosting mana pun. */
export const cmsMedia = pgTable("cms_media", {
  id: serial("id").primaryKey(),
  mime: text("mime").notNull(),
  size: integer("size").notNull(),
  data: bytea("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type RfqRequest = typeof rfqRequests.$inferSelect;
export type NewRfqRequest = typeof rfqRequests.$inferInsert;

/**
 * DDL yang sama dengan schema di atas. Dijalankan sekali per proses agar
 * website langsung jalan tanpa langkah migrasi manual (aman dijalankan berulang).
 */
export const BOOTSTRAP_SQL = `
CREATE TABLE IF NOT EXISTS rfq_requests (
  id serial PRIMARY KEY,
  ref_code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  company text NOT NULL,
  position text,
  email text NOT NULL,
  phone text NOT NULL,
  sector text NOT NULL,
  categories jsonb NOT NULL DEFAULT '[]'::jsonb,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  delivery_location text,
  needed_by date,
  notes text,
  status text NOT NULL DEFAULT 'baru'
);
CREATE INDEX IF NOT EXISTS rfq_requests_created_at_idx ON rfq_requests (created_at DESC);
CREATE TABLE IF NOT EXISTS cms_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cms_media (
  id serial PRIMARY KEY,
  mime text NOT NULL,
  size integer NOT NULL,
  data bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
`;
