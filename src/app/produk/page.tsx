import type { Metadata } from "next";
import Link from "next/link";
import { getAllContent } from "@/lib/cms";
import { Arrow } from "@/components/ui";
import { ProductImage } from "@/components/ProductImage";

export const metadata: Metadata = {
  title: "Katalog Produk",
  description:
    "Lini produk PT. Meta Inti Persada: pipeline & pipe accessories, casing spacer, valve, flange, peralatan mekanikal, elektrikal, instrumentasi, dan komponen PLTS.",
};

const pad = (n: number) => String(n).padStart(2, "0");

export default async function ProdukPage() {
  const { catalog, pillars } = await getAllContent();
  return (
    <>
      <section className="border-b border-line">
        <div className="wrap grid gap-8 pt-16 pb-14 md:grid-cols-12 md:pt-24 md:pb-20">
          <p className="tag text-muted md:col-span-3">
            <span className="text-brand">Katalog</span>
            <span className="mx-2 opacity-50">/</span>Lini Produk
          </p>
          <div className="md:col-span-9">
            <h1 className="text-display max-w-[14ch]">Apa yang bisa kami adakan.</h1>
            <p className="mt-8 max-w-[58ch] text-[17px] leading-relaxed text-muted">
              Ringkasan lini produk yang kami tangani. Merek, standar, ukuran, dan material mengikuti spesifikasi
              proyek Anda — sertakan detailnya di RFQ dan kami carikan sumber yang tepat.
            </p>
          </div>
        </div>
      </section>

      {/* Indeks pilar sebagai anchor */}
      <div className="sticky top-16 z-30 border-b border-line bg-paper/92 backdrop-blur-md">
        <nav aria-label="Pilar bisnis" className="wrap flex gap-6 overflow-x-auto py-3 [scrollbar-width:none]">
          {pillars.map((p) => (
            <a key={p.slug} href={`#${p.slug}`} className="tag shrink-0 py-1 text-muted hover:text-ink">
              <span className="text-brand">{p.code}</span>&nbsp;&nbsp;{p.title}
            </a>
          ))}
        </nav>
      </div>

      <div className="wrap py-16 md:py-24">
        {pillars.map((p) => {
          const groups = catalog.filter((c) => c.pillar === p.slug);
          return (
            <section key={p.slug} id={p.slug} className="scroll-mt-32 border-t border-ink pt-8 pb-20 last:pb-0">
              <div className="grid gap-6 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-3">
                  <p className="text-[56px] leading-none tracking-[-0.04em] text-brand">{p.code}</p>
                </div>
                <div className="md:col-span-9">
                  <h2 className="text-h2">{p.title}</h2>
                  <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-muted">{p.summary}</p>

                  {groups.map((g) => (
                    <div key={g.id} id={g.id} className="mt-12 scroll-mt-32">
                      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-3">
                        <h3 className="text-[22px] tracking-[-0.01em]">{g.title}</h3>
                        <p className="tag text-muted">{g.intro}</p>
                      </div>
                      <ul>
                        {g.lines.map((l, i) => (
                          <li
                            key={i}
                            className="group grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-1 border-b border-line py-5 sm:grid-cols-[2.5rem_6rem_14rem_1fr_auto] sm:items-center sm:gap-x-6"
                          >
                            <span className="tag text-muted">{pad(i + 1)}</span>
                            <span className="relative col-start-2 mb-2 block aspect-[4/3] w-28 overflow-hidden bg-paper-2 sm:col-start-auto sm:mb-0 sm:w-24">
                              {l.image ? <ProductImage src={l.image} alt={l.name} /> : null}
                            </span>
                            <span className="col-start-2 text-[17px] sm:col-start-auto">{l.name}</span>
                            <span className="col-start-2 text-[15px] leading-relaxed text-muted sm:col-start-auto">
                              {l.detail}
                            </span>
                            <Link
                              href={`/rfq?item=${encodeURIComponent(l.name)}`}
                              className="link-arrow col-start-2 mt-2 text-[14px] text-muted transition-colors hover:text-brand group-hover:text-brand sm:col-start-auto sm:mt-0"
                            >
                              Minta harga
                              <Arrow className="h-3 w-3" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="border-t border-line bg-paper-2/60">
        <div className="wrap flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <p className="max-w-[40ch] text-[22px] leading-snug tracking-[-0.01em]">
            Tidak menemukan item yang Anda cari? Kirim spesifikasinya — kami carikan.
          </p>
          <Link
            href="/rfq"
            className="link-arrow rounded-[2px] bg-ink px-5 py-3.5 text-[15px] text-white transition-colors hover:bg-brand-deep"
          >
            Ajukan RFQ
            <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
