import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import * as base from "@/content/company";

/**
 * Konten website: nilai bawaan ada di src/content/company.ts, dan bisa ditimpa dari
 * panel admin (tabel cms_content). Setiap nilai tersimpan selalu "dirapikan" mengikuti
 * bentuk nilai bawaan, sehingga halaman publik tidak pernah menerima data yang rusak.
 */
export const CONTENT_DEFAULTS = {
  company: base.company,
  pillars: base.pillars,
  casingSpacer: base.casingSpacer,
  renewable: base.renewable,
  catalog: base.catalog,
  processSteps: base.processSteps,
  values: base.values,
  sectors: base.sectors,
  rfqCategoryOptions: base.rfqCategoryOptions,
  rfqSectorOptions: base.rfqSectorOptions,
};

export type ContentKey = keyof typeof CONTENT_DEFAULTS;
export type Content = typeof CONTENT_DEFAULTS;

export const CONTENT_META: Record<ContentKey, { title: string; desc: string }> = {
  company: { title: "Profil Perusahaan", desc: "Nama, tagline, kontak, alamat, ringkasan, fokus, visi & misi." },
  pillars: { title: "Empat Pilar Bisnis", desc: "Ringkasan dan daftar item tiap lini bisnis." },
  casingSpacer: { title: "Casing Spacer", desc: "Penjelasan produk unggulan dan manfaatnya." },
  renewable: { title: "Energi Terbarukan & PLTS", desc: "Teks section PLTS dan paket komponennya." },
  catalog: { title: "Katalog Produk", desc: "Kelompok produk beserta daftar barangnya." },
  processSteps: { title: "Alur Pengadaan", desc: "Empat tahap dari identifikasi sampai delivery." },
  values: { title: "Nilai Unggulan", desc: "Keunggulan perusahaan." },
  sectors: { title: "Sektor Layanan", desc: "Segmen pelanggan, kebutuhan, dan layanan." },
  rfqCategoryOptions: { title: "Pilihan Kategori RFQ", desc: "Daftar kategori pada formulir RFQ." },
  rfqSectorOptions: { title: "Pilihan Sektor RFQ", desc: "Daftar sektor pada formulir RFQ." },
};

export const CONTENT_KEYS = Object.keys(CONTENT_DEFAULTS) as ContentKey[];
export const isContentKey = (k: string): k is ContentKey => k in CONTENT_DEFAULTS;

const MAX_STR = 4000;
const MAX_ITEMS = 100;

/** Bentuk dan tipe mengikuti `def`; apa pun yang menyimpang diganti nilai bawaan. */
function conform<T>(def: T, val: unknown): T {
  if (typeof def === "string") {
    return (typeof val === "string" ? val.slice(0, MAX_STR) : def) as T;
  }
  if (Array.isArray(def)) {
    if (!Array.isArray(val)) return def;
    const tpl = def[0];
    return val.slice(0, MAX_ITEMS).map((v) => conform(tpl, v)) as T;
  }
  if (def && typeof def === "object") {
    const src = val && typeof val === "object" && !Array.isArray(val) ? (val as Record<string, unknown>) : {};
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(def)) out[k] = conform((def as Record<string, unknown>)[k], src[k]);
    return out as T;
  }
  return def;
}

/**
 * Daftar yang strukturnya dipakai kode halaman (id/slug dirujuk silang): jumlah item dan
 * kolom pengenalnya dikunci mengikuti nilai bawaan.
 */
/** Gambar hanya boleh dari file di /photos atau unggahan CMS di /media (bukan URL bebas). */
const IMAGE_PATH = /^(|\/photos\/[\w.-]+|\/media\/\d+)$/;

const LOCKED: Partial<Record<ContentKey, string>> = { catalog: "id", pillars: "slug" };

export function sanitize<K extends ContentKey>(key: K, val: unknown): Content[K] {
  const def = CONTENT_DEFAULTS[key];
  const out = conform(def, val);
  const lock = LOCKED[key];
  if (lock && Array.isArray(def)) {
    const d = def as Record<string, unknown>[];
    const o = Array.isArray(val) ? (out as Record<string, unknown>[]) : d;
    return d.map((item, i) => {
      const merged = { ...(o[i] ?? item), [lock]: item[lock] };
      if (key === "catalog" && !IMAGE_PATH.test(String(merged.image))) merged.image = item.image;
      return merged;
    }) as Content[K];
  }
  return out;
}

const loadOverrides = cache(async (): Promise<Map<string, unknown>> => {
  try {
    const db = await getDb();
    const rows = await db.select().from(schema.cmsContent);
    return new Map(rows.map((r) => [r.key, r.value]));
  } catch {
    return new Map();
  }
});

export async function getContent<K extends ContentKey>(key: K): Promise<Content[K]> {
  const o = await loadOverrides();
  return o.has(key) ? sanitize(key, o.get(key)) : CONTENT_DEFAULTS[key];
}

export async function getAllContent(): Promise<Content> {
  const o = await loadOverrides();
  const out: Record<string, unknown> = {};
  for (const k of CONTENT_KEYS) out[k] = o.has(k) ? sanitize(k, o.get(k)) : CONTENT_DEFAULTS[k];
  return out as Content;
}

export async function getOverrideInfo(): Promise<Map<ContentKey, Date>> {
  const db = await getDb();
  const rows = await db.select().from(schema.cmsContent);
  return new Map(rows.filter((r) => isContentKey(r.key)).map((r) => [r.key as ContentKey, r.updatedAt]));
}

export async function saveContent(key: ContentKey, val: unknown) {
  const value = sanitize(key, val);
  const db = await getDb();
  await db
    .insert(schema.cmsContent)
    .values({ key, value })
    .onConflictDoUpdate({ target: schema.cmsContent.key, set: { value, updatedAt: new Date() } });
}

export async function resetContent(key: ContentKey) {
  const db = await getDb();
  await db.delete(schema.cmsContent).where(eq(schema.cmsContent.key, key));
}
