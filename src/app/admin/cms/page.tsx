import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { CONTENT_KEYS, CONTENT_META, getOverrideInfo } from "@/lib/cms";
import { Arrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Konten Website",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const fmt = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });

export default async function CmsIndexPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const edited = await getOverrideInfo();

  return (
    <section className="py-12 md:py-16">
      <div className="wrap">
        <div className="border-b border-ink pb-6">
          <span aria-hidden="true" className="mb-5 block h-1 w-12 bg-accent" />
          <p className="tag text-muted">
            <span className="text-accent">Admin</span>
            <span className="mx-2 opacity-50">/</span>CMS
          </p>
          <h1 className="mt-3 text-[40px] leading-none tracking-[-0.03em]">Konten Website</h1>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-muted">
            Pilih bagian yang ingin diubah. Perubahan langsung tampil di website setelah disimpan. Bagian yang belum
            pernah diubah memakai teks bawaan.
          </p>
        </div>

        <ul className="mt-2">
          {CONTENT_KEYS.map((k) => {
            const at = edited.get(k);
            return (
              <li key={k} className="border-b border-line">
                <Link href={`/admin/cms/${k}`} className="link-arrow group grid gap-2 py-5 md:grid-cols-[18rem_1fr_12rem] md:items-center md:gap-6">
                  <span className="text-[18px]">{CONTENT_META[k].title}</span>
                  <span className="text-[14px] text-muted">{CONTENT_META[k].desc}</span>
                  <span className="flex items-center justify-between gap-3 text-[13px] md:justify-end">
                    {at ? (
                      <span className="rounded-full bg-accent-tint px-3 py-1 text-accent-deep">Diubah {fmt.format(at)}</span>
                    ) : (
                      <span className="text-muted">Bawaan</span>
                    )}
                    <Arrow className="h-3 w-3 shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
