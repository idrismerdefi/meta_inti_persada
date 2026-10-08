import { getDb, schema } from "@/db";
import { isAdmin } from "@/lib/auth";

const MAX_BYTES = 4 * 1024 * 1024;

/** Tipe file ditentukan dari isi file (magic bytes), bukan dari nama atau header klien. */
function sniff(b: Uint8Array): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50)
    return "image/webp";
  return null;
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Tidak diizinkan." }, { status: 401 });

  const file = (await req.formData()).get("file");
  if (!(file instanceof File)) return Response.json({ error: "File tidak ditemukan." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "Ukuran gambar maksimal 4 MB." }, { status: 413 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = sniff(bytes);
  if (!mime) return Response.json({ error: "Format harus JPG, PNG, atau WebP." }, { status: 415 });

  const db = await getDb();
  const [row] = await db
    .insert(schema.cmsMedia)
    .values({ mime, size: bytes.length, data: Buffer.from(bytes) })
    .returning({ id: schema.cmsMedia.id });
  return Response.json({ url: `/media/${row.id}` });
}
