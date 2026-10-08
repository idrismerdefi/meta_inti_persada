import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { CONTENT_META, getContent, getOverrideInfo, isContentKey } from "@/lib/cms";
import { resetSection } from "../actions";
import { ContentEditor } from "../ContentEditor";

export const metadata: Metadata = {
  title: "Ubah Konten",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// Daftar yang dirujuk silang oleh kode halaman: jumlah item dan kolom pengenalnya dikunci.
const LOCKED: Record<string, string> = { catalog: "id", pillars: "slug" };

export default async function CmsEditPage({ params }: { params: Promise<{ key: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { key } = await params;
  if (!isContentKey(key)) notFound();

  const [content, edited] = await Promise.all([getContent(key), getOverrideInfo()]);

  return (
    <section className="py-12 md:py-16">
      <div className="wrap max-w-[860px]">
        <div className="border-b border-ink pb-6">
          <span aria-hidden="true" className="mb-5 block h-1 w-12 bg-accent" />
          <p className="tag text-muted">
            <Link href="/admin/cms" className="text-accent hover:underline">
              Konten Website
            </Link>
            <span className="mx-2 opacity-50">/</span>
            {CONTENT_META[key].title}
          </p>
          <h1 className="mt-3 text-[36px] leading-none tracking-[-0.03em]">{CONTENT_META[key].title}</h1>
          <p className="mt-4 text-[15px] text-muted">{CONTENT_META[key].desc}</p>
          {LOCKED[key] ? (
            <p className="mt-3 text-[13px] text-muted">
              Jumlah kelompok dan kolom <code className="font-mono">{LOCKED[key]}</code> dikunci karena dipakai halaman lain.
              Teks dan daftar di dalamnya tetap bebas diubah.
            </p>
          ) : null}
        </div>

        <div className="mt-8">
          <ContentEditor
            contentKey={key}
            initial={content as never}
            locked={LOCKED[key]}
            resetAction={resetSection.bind(null, key)}
            isEdited={edited.has(key)}
          />
        </div>
      </div>
    </section>
  );
}
