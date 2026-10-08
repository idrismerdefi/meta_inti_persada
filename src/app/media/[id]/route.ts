import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return new Response("Not found", { status: 404 });

  const db = await getDb();
  const [row] = await db.select().from(schema.cmsMedia).where(eq(schema.cmsMedia.id, id)).limit(1);
  if (!row) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.mime,
      "Content-Length": String(row.size),
      // Setiap unggahan punya id baru, jadi isinya tidak pernah berubah.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
