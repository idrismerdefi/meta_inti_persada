"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { getDb, schema } from "@/db";
import type { RfqItem } from "@/db/schema";

export type RfqValues = {
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  sector: string;
  categories: string[];
  items: RfqItem[];
  deliveryLocation: string;
  neededBy: string;
  notes: string;
};

export type RfqState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors: Partial<Record<keyof RfqValues, string>>; values: RfqValues }
  | { status: "success"; refCode: string; email: string; company: string };

const rfqSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(120),
  position: z.string().trim().max(120),
  company: z.string().trim().min(2, "Nama perusahaan wajib diisi.").max(160),
  email: z.email("Format email tidak valid.").max(160),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s.-]{8,24}$/, "Nomor telepon/WhatsApp tidak valid."),
  sector: z.string().trim().min(1, "Pilih sektor industri."),
  categories: z.array(z.string().max(80)).max(20),
  items: z
    .array(
      z.object({
        description: z.string().trim().max(600),
        qty: z.string().trim().max(30),
        unit: z.string().trim().max(30),
      }),
    )
    .refine((items) => items.some((i) => i.description.length > 0), "Isi minimal satu item yang dibutuhkan."),
  deliveryLocation: z.string().trim().max(200),
  neededBy: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Tanggal tidak valid."),
  notes: z.string().trim().max(3000),
});

function readForm(fd: FormData): RfqValues {
  const str = (k: string) => String(fd.get(k) ?? "");
  const descriptions = fd.getAll("item_description").map(String);
  const qtys = fd.getAll("item_qty").map(String);
  const units = fd.getAll("item_unit").map(String);
  return {
    name: str("name"),
    position: str("position"),
    company: str("company"),
    email: str("email").trim(),
    phone: str("phone"),
    sector: str("sector"),
    categories: fd.getAll("categories").map(String),
    items: descriptions.map((description, i) => ({ description, qty: qtys[i] ?? "", unit: units[i] ?? "" })),
    deliveryLocation: str("deliveryLocation"),
    neededBy: str("neededBy"),
    notes: str("notes"),
  };
}

function makeRefCode() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate(),
  ).padStart(2, "0")}`;
  return `RFQ-${ymd}-${randomBytes(2).toString("hex").toUpperCase()}`;
}

export async function submitRfq(_prev: RfqState, fd: FormData): Promise<RfqState> {
  const values = readForm(fd);

  // Honeypot: field tersembunyi yang hanya diisi bot.
  if (String(fd.get("website") ?? "") !== "") {
    return { status: "success", refCode: "RFQ-000000-0000", email: values.email, company: values.company };
  }

  const parsed = rfqSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof RfqValues, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RfqValues;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Periksa kembali isian yang ditandai.", fieldErrors, values };
  }

  const data = parsed.data;
  const items = data.items.filter((i) => i.description.length > 0);

  try {
    const db = await getDb();
    let refCode = makeRefCode();
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await db.insert(schema.rfqRequests).values({
          refCode,
          name: data.name,
          position: data.position || null,
          company: data.company,
          email: data.email,
          phone: data.phone,
          sector: data.sector,
          categories: data.categories,
          items,
          deliveryLocation: data.deliveryLocation || null,
          neededBy: data.neededBy || null,
          notes: data.notes || null,
        });
        break;
      } catch (err) {
        // Bentrok kode referensi (sangat jarang) → buat ulang lalu coba lagi.
        if (attempt < 2 && String(err).includes("ref_code")) {
          refCode = makeRefCode();
          continue;
        }
        throw err;
      }
    }
    return { status: "success", refCode, email: data.email, company: data.company };
  } catch (err) {
    console.error("[rfq] gagal menyimpan", err);
    return {
      status: "error",
      message: "Permintaan belum tersimpan karena gangguan server. Silakan coba lagi, atau kirim lewat email.",
      fieldErrors: {},
      values,
    };
  }
}
