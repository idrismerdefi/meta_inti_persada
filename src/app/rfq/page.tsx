import type { Metadata } from "next";
import { getAllContent } from "@/lib/cms";
import type { Content } from "@/lib/cms";
import { RfqForm } from "@/components/RfqForm";

export const metadata: Metadata = {
  title: "Request for Quotation",
  description:
    "Kirim permintaan penawaran (RFQ) untuk peralatan industri, pipeline accessories, casing spacer, valve, flange, dan komponen PLTS.",
};

type Search = Promise<{ kategori?: string | string[]; item?: string | string[] }>;

const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function RfqPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const { company, processSteps, rfqCategoryOptions, rfqSectorOptions } = await getAllContent();
  const kategori = first(sp.kategori);
  const item = first(sp.item).slice(0, 200);
  const defaultCategories = rfqCategoryOptions.includes(kategori) ? [kategori] : [];

  return (
    <section className="py-16 md:py-24">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Intro (+ panduan di desktop) */}
        <div className="lg:col-span-4">
          <p className="tag text-muted">
            <span className="text-brand">RFQ</span>
            <span className="mx-2 opacity-50">/</span>Request for Quotation
          </p>
          <h1 className="mt-6 text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1] tracking-[-0.035em]">
            Minta penawaran harga.
          </h1>
          <p className="mt-6 max-w-[40ch] text-[16px] leading-relaxed text-muted">
            Semakin lengkap spesifikasi yang Anda kirim, semakin cepat dan akurat penawaran yang bisa kami siapkan.
          </p>
          <div className="mt-10 hidden lg:block">
            <Guide company={company} processSteps={processSteps} />
          </div>
        </div>

        {/* Form — di mobile langsung setelah intro, di desktop kolom kanan */}
        <div className="lg:col-span-8">
          <RfqForm
            defaultCategories={defaultCategories}
            defaultItem={item}
            email={company.email}
            categories={rfqCategoryOptions}
            sectors={rfqSectorOptions}
          />
        </div>

        {/* Panduan — di mobile tampil setelah form */}
        <aside className="lg:hidden">
          <Guide company={company} processSteps={processSteps} />
        </aside>
      </div>
    </section>
  );
}

function Guide({ company, processSteps }: { company: Content["company"]; processSteps: Content["processSteps"] }) {
  return (
    <>
      <div className="border-t border-line pt-6">
        <p className="tag text-muted">Yang sebaiknya disertakan</p>
        <ul className="mt-4 space-y-2.5 text-[15px]">
          <li>— Ukuran, material, dan rating/kelas</li>
          <li>— Standar acuan (API, ASME, ANSI, SNI…)</li>
          <li>— Kuantitas dan satuan</li>
          <li>— Lokasi dan target waktu pengiriman</li>
        </ul>
      </div>

      <div className="mt-10 border-t border-line pt-6">
        <p className="tag text-muted">Setelah Anda mengirim</p>
        <ol className="mt-4 space-y-3">
          {processSteps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[2rem_1fr] text-[15px]">
              <span className="tag pt-0.5 text-brand">{String(i + 1).padStart(2, "0")}</span>
              <span>
                {s.title} <span className="text-muted">— {s.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-10 border-t border-line pt-6 text-[15px]">
        <p className="tag text-muted">Lebih suka email?</p>
        <a href={`mailto:${company.email}`} className="mt-3 inline-block break-all text-brand underline underline-offset-4">
          {company.email}
        </a>
      </div>
    </>
  );
}
