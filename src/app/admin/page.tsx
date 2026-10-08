import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { RFQ_STATUSES, type RfqStatus } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { logout, updateStatus } from "./actions";

export const metadata: Metadata = {
  title: "Daftar RFQ",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<RfqStatus, string> = {
  baru: "Baru",
  diproses: "Diproses",
  "penawaran-dikirim": "Penawaran dikirim",
  selesai: "Selesai",
  batal: "Batal",
};

const STATUS_TONE: Record<RfqStatus, string> = {
  baru: "bg-accent text-white",
  diproses: "bg-[#fde68a] text-ink",
  "penawaran-dikirim": "bg-[#c7d8f7] text-ink",
  selesai: "bg-[#d1e7d6] text-ink",
  batal: "bg-paper-2 text-muted",
};

const fmt = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

type Search = Promise<{ status?: string }>;

export default async function AdminPage({ searchParams }: { searchParams: Search }) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { status } = await searchParams;
  const active = RFQ_STATUSES.includes(status as RfqStatus) ? (status as RfqStatus) : undefined;

  const db = await getDb();
  const t = schema.rfqRequests;
  const [rows, counts] = await Promise.all([
    db
      .select()
      .from(t)
      .where(active ? eq(t.status, active) : undefined)
      .orderBy(desc(t.createdAt))
      .limit(200),
    db
      .select({ status: t.status, n: sql<number>`count(*)::int` })
      .from(t)
      .groupBy(t.status),
  ]);
  const countOf = (s?: RfqStatus) =>
    s ? (counts.find((c) => c.status === s)?.n ?? 0) : counts.reduce((a, c) => a + Number(c.n), 0);

  return (
    <section className="py-12 md:py-16">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-6">
          <div>
            <span aria-hidden="true" className="mb-5 block h-1 w-12 bg-accent" />
            <p className="tag text-muted">
              <span className="text-accent">Admin</span>
              <span className="mx-2 opacity-50">/</span>Request for Quotation
            </p>
            <h1 className="mt-3 text-[40px] leading-none tracking-[-0.03em]">Daftar RFQ</h1>
          </div>
          <form action={logout}>
            <button className="text-[14px] text-muted underline underline-offset-4 hover:text-ink">Keluar</button>
          </form>
        </div>

        <nav aria-label="Filter status" className="mt-6 flex flex-wrap gap-2">
          {[undefined, ...RFQ_STATUSES].map((s) => {
            const on = s === active;
            return (
              <Link
                key={s ?? "all"}
                href={s ? `/admin?status=${s}` : "/admin"}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                  on ? "border-ink bg-ink text-white" : "border-line hover:border-ink/50"
                }`}
              >
                {s ? STATUS_LABEL[s] : "Semua"} <span className="ml-1 font-mono opacity-60">{countOf(s)}</span>
              </Link>
            );
          })}
        </nav>

        {rows.length === 0 ? (
          <p className="mt-16 text-[16px] text-muted">Belum ada RFQ{active ? " dengan status ini" : ""}.</p>
        ) : (
          <ul className="mt-8 border-t border-line">
            {rows.map((r) => (
              <li key={r.id} className="border-b border-line">
                <details className="group">
                  <summary className="grid cursor-pointer list-none gap-2 py-5 md:grid-cols-[11rem_1fr_14rem_10rem] md:items-center md:gap-6 [&::-webkit-details-marker]:hidden">
                    <span className="font-mono text-[13px]">{r.refCode}</span>
                    <span>
                      <span className="text-[17px]">{r.company}</span>
                      <span className="ml-2 text-[14px] text-muted">
                        {r.name} · {r.items.length} item
                      </span>
                    </span>
                    <span className="text-[13px] text-muted">{fmt.format(r.createdAt)}</span>
                    <span className={`justify-self-start rounded-full px-3 py-1 text-[12px] md:justify-self-end ${STATUS_TONE[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </summary>

                  <div className="grid gap-8 pb-8 md:grid-cols-12">
                    <dl className="grid content-start gap-4 text-[14px] md:col-span-4">
                      <div>
                        <dt className="tag text-muted">Kontak</dt>
                        <dd className="mt-1">
                          {r.name}
                          {r.position ? <span className="text-muted"> — {r.position}</span> : null}
                        </dd>
                        <dd>
                          <a className="text-brand underline-offset-4 hover:underline" href={`mailto:${r.email}`}>
                            {r.email}
                          </a>
                        </dd>
                        <dd>
                          <a className="text-brand underline-offset-4 hover:underline" href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}>
                            {r.phone}
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className="tag text-muted">Sektor</dt>
                        <dd className="mt-1">{r.sector}</dd>
                      </div>
                      {r.categories.length ? (
                        <div>
                          <dt className="tag text-muted">Kategori</dt>
                          <dd className="mt-1">{r.categories.join(", ")}</dd>
                        </div>
                      ) : null}
                      <div>
                        <dt className="tag text-muted">Pengiriman</dt>
                        <dd className="mt-1">
                          {r.deliveryLocation || "—"}
                          {r.neededBy ? <span className="text-muted"> · paling lambat {r.neededBy}</span> : null}
                        </dd>
                      </div>
                    </dl>

                    <div className="md:col-span-8">
                      <table className="w-full border-collapse text-left text-[14px]">
                        <thead>
                          <tr className="tag border-b border-ink text-muted">
                            <th className="w-10 pb-2 font-normal">#</th>
                            <th className="pb-2 font-normal">Deskripsi</th>
                            <th className="w-20 pb-2 font-normal">Qty</th>
                            <th className="w-20 pb-2 font-normal">Satuan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.items.map((it, i) => (
                            <tr key={i} className="border-b border-line align-top">
                              <td className="py-2.5 font-mono text-[12px] text-muted">{i + 1}</td>
                              <td className="py-2.5 pr-4">{it.description}</td>
                              <td className="py-2.5">{it.qty || "—"}</td>
                              <td className="py-2.5">{it.unit || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {r.notes ? (
                        <p className="mt-5 whitespace-pre-line border-l-2 border-line pl-4 text-[14px] text-muted">{r.notes}</p>
                      ) : null}

                      <form action={updateStatus} className="mt-6 flex flex-wrap items-center gap-3">
                        <input type="hidden" name="id" value={r.id} />
                        <label htmlFor={`st-${r.id}`} className="text-[14px]">
                          Ubah status
                        </label>
                        <select id={`st-${r.id}`} name="status" defaultValue={r.status} className="field select-chevron w-auto py-2 text-[14px]">
                          {RFQ_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABEL[s]}
                            </option>
                          ))}
                        </select>
                        <button className="rounded-[2px] bg-ink px-4 py-2 text-[14px] text-white hover:bg-accent">Simpan</button>
                        <a
                          href={`mailto:${r.email}?subject=${encodeURIComponent(`Penawaran ${r.refCode} — PT. Meta Inti Persada`)}`}
                          className="ml-auto text-[14px] text-brand underline-offset-4 hover:underline"
                        >
                          Balas via email
                        </a>
                      </form>
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
