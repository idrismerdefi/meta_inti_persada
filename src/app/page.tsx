import Image from "next/image";
import Link from "next/link";
import { getAllContent } from "@/lib/cms";
import { Arrow, ButtonLink, SectionHead } from "@/components/ui";
import { PipelineCrossing } from "@/components/drawings/PipelineCrossing";
import { SolarArray } from "@/components/drawings/SolarArray";

const pad = (n: number) => String(n).padStart(2, "0");

export default async function HomePage() {
  const { casingSpacer, catalog, company, pillars, processSteps, renewable, sectors, values } = await getAllContent();
  const pipeline = catalog.find((c) => c.id === "pipeline")!;
  const technical = catalog.filter((c) => ["mechanical", "electrical", "instrumentation"].includes(c.id));

  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="drafting-grid relative overflow-hidden bg-steel text-white">
        <div className="wrap relative pt-10 pb-0 md:pt-14">
          <div className="tag flex flex-wrap items-center justify-between gap-3 border-b border-line-inv pb-4 text-white/55">
            <span>PT. Meta Inti Persada — Jakarta, Indonesia</span>
            <span className="hidden sm:inline">Trade · Procurement · Oil &amp; Gas · EBT</span>
          </div>

          <div className="grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-6">
              <h1 className="text-display max-w-[13ch]">
                Pengadaan industri &amp; migas, <span className="text-[#8fbaf3]">tepat spesifikasi.</span>
              </h1>
              <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-white/72 md:text-[18px]">
                {company.overview[0]}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <ButtonLink href="/rfq" variant="brand">
                  Ajukan RFQ
                </ButtonLink>
                <ButtonLink href="/produk" variant="ghost-inv">
                  Lihat katalog
                </ButtonLink>
              </div>
            </div>

            <div className="lg:col-span-6">
              <Image
                src="/brand/logo-hero-v2.png"
                alt="Logo PT. Meta Inti Persada — driving digital transformation"
                width={1480}
                height={1000}
                priority
                quality={95}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="mx-auto h-auto w-full max-w-[560px]"
              />
            </div>
          </div>

          {/* Empat pilar sebagai indeks di dasar hero */}
          <ol className="grid grid-cols-2 border-t border-line-inv md:grid-cols-4">
            {pillars.map((p, i) => (
              <li
                key={p.slug}
                className={[
                  "border-line-inv py-6 pr-4",
                  i % 2 === 1 ? "border-l pl-4" : "",
                  i === 2 ? "md:border-l md:pl-6" : "",
                  i > 0 ? "md:pl-6" : "",
                  i >= 2 ? "border-t md:border-t-0" : "",
                ].join(" ")}
              >
                <Link href={`/produk#${p.slug}`} className="group block">
                  <span className="tag text-accent-bright">{p.code}</span>
                  <span className="mt-2 flex items-center justify-between gap-3 text-[16px] md:text-[17px]">
                    {p.title}
                    <Arrow className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────────────────── 01 PROFIL ───────────────────────── */}
      <section id="profil" className="py-24 md:py-32">
        <div className="wrap">
          <SectionHead
            index="01"
            label="Profil Perusahaan"
            title="Penyambung antara produsen berkualitas dan kebutuhan proyek Anda."
            intro={company.overview[1]}
          />

          <figure className="relative mt-16 aspect-[16/9] overflow-hidden bg-ink md:aspect-[21/9]">
            <Image
              src="/photos/refinery.jpg"
              alt="Fasilitas kilang minyak dan gas pada malam hari"
              fill
              sizes="(min-width: 1320px) 1256px, 100vw"
              className="object-cover"
            />
            <figcaption className="tag absolute bottom-0 left-0 bg-ink/85 px-4 py-2 text-white/80">
              <span className="text-accent-bright">Fig. 01</span> — Fasilitas migas
            </figcaption>
          </figure>

          <div className="mt-px grid gap-px border-y border-line bg-line md:grid-cols-3">
            {company.focus.map((f, i) => (
              <div key={f.title} className="bg-paper py-8 md:px-8 md:first:pl-0">
                <span className="tag text-muted">Fokus {pad(i + 1)}</span>
                <h3 className="mt-4 text-[22px] leading-tight tracking-[-0.01em]">{f.title}</h3>
                <p className="mt-3 max-w-[36ch] text-[15px] leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>

          {/* Visi & Misi */}
          <div className="mt-24 grid gap-14 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-3">
              <p className="tag text-muted">Visi &amp; Misi</p>
            </div>
            <figure className="md:col-span-9 lg:col-span-8">
              <blockquote className="text-[clamp(1.5rem,2.6vw,2.25rem)] italic leading-[1.25] tracking-[-0.015em]">
                “{company.vision}”
              </blockquote>
              <figcaption className="tag mt-6 text-muted">— Visi PT. Meta Inti Persada</figcaption>

              <ol className="mt-14 grid gap-x-10 sm:grid-cols-2">
                {company.mission.map((m, i) => (
                  <li key={m} className="flex gap-5 border-t border-line py-5">
                    <span className="tag pt-1 text-accent">M{i + 1}</span>
                    <span className="text-[16px] leading-relaxed">{m}</span>
                  </li>
                ))}
              </ol>
            </figure>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 02 LINI BISNIS ───────────────────────── */}
      <section id="lini-bisnis" className="border-t border-line bg-paper-2/60 py-24 md:py-32">
        <div className="wrap">
          <SectionHead
            index="02"
            label="Lini Bisnis"
            title="Empat pilar, satu pintu pengadaan."
            intro="Dari material proyek hingga komponen energi terbarukan — kebutuhan lintas disiplin ditangani oleh satu tim yang sama."
          />

          <ul className="mt-16 border-t border-ink">
            {pillars.map((p) => (
              <li key={p.slug} className="border-b border-line">
                <Link
                  href={`/produk#${p.slug}`}
                  className="group grid gap-4 py-8 transition-colors md:grid-cols-12 md:gap-8 md:py-10"
                >
                  <span className="text-[44px] leading-none tracking-[-0.04em] text-brand md:col-span-1 md:text-[56px]">
                    {p.code}
                  </span>
                  <div className="md:col-span-4">
                    <h3 className="text-[26px] leading-tight tracking-[-0.02em] md:text-[30px]">{p.title}</h3>
                  </div>
                  <div className="md:col-span-6">
                    <p className="max-w-[52ch] text-[16px] leading-relaxed text-muted">{p.summary}</p>
                  </div>
                  <span className="hidden items-start justify-end pt-2 md:col-span-1 md:flex">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                      <Arrow className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────────────────── 03 CASING SPACER ───────────────────────── */}
      <section id="casing-spacer" className="py-24 md:py-32">
        <div className="wrap">
          <SectionHead
            index="03"
            label="Produk Unggulan"
            title={
              <>
                Casing Spacer — {casingSpacer.headline.toLowerCase()}.
              </>
            }
            intro={casingSpacer.body}
          />

          <div className="drafting-grid-light mt-16 border border-line bg-white/60 px-4 py-8 md:px-10 md:py-12">
            <div className="tag mb-6 flex flex-wrap justify-between gap-2 text-muted">
              <span>Tampak memanjang — pipeline crossing</span>
              <span className="hidden sm:inline">Ilustrasi skematik</span>
              <span className="sm:hidden">Geser untuk melihat →</span>
            </div>
            <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
              <PipelineCrossing className="h-auto w-full min-w-[640px]" />
            </div>
          </div>

          <div className="mt-px grid gap-px bg-line md:grid-cols-3">
            {casingSpacer.benefits.map((b, i) => (
              <div key={b.title} className="bg-paper py-8 md:px-8 md:first:pl-0">
                <p className="tag text-accent">Catatan {i + 1}</p>
                <h3 className="mt-3 text-[20px] tracking-[-0.01em]">{b.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{b.body}</p>
              </div>
            ))}
          </div>

          {/* Aksesoris pipeline lainnya */}
          <div className="mt-24 grid gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-3">
              <p className="tag text-muted">Pipeline &amp; Pipe Accessories</p>
              <p className="mt-4 max-w-[28ch] text-[15px] leading-relaxed text-muted">
                Pelengkap casing spacer untuk jalur pipa migas dan fasilitas proses.
              </p>
            </div>
            <dl className="md:col-span-9">
              {pipeline.lines.slice(1).map((l) => (
                <div key={l.name} className="grid gap-1 border-t border-line py-5 sm:grid-cols-9 sm:gap-8">
                  <dt className="text-[18px] tracking-[-0.01em] sm:col-span-3">{l.name}</dt>
                  <dd className="text-[15px] leading-relaxed text-muted sm:col-span-6">{l.detail}</dd>
                </div>
              ))}
              <div className="border-t border-line pt-6">
                <Link href="/rfq?kategori=Casing%20Spacer%20%2F%20Insulator" className="link-arrow text-[15px] text-brand">
                  Minta penawaran casing spacer
                  <Arrow />
                </Link>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 04 PLTS ───────────────────────── */}
      <section id="plts" className="drafting-grid bg-brand-deep py-24 text-white md:py-32">
        <div className="wrap">
          <SectionHead
            index="04"
            label={renewable.eyebrow}
            title={renewable.title}
            intro={renewable.body[0]}
            inverted
          />

          <div className="mt-16 grid items-start gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <SolarArray className="h-auto w-full" />
              <figure className="relative mt-8 aspect-[16/9] overflow-hidden">
                <Image
                  src="/photos/solar.jpg"
                  alt="Deretan panel surya di bawah langit biru"
                  fill
                  sizes="(min-width: 1024px) 700px, 100vw"
                  className="object-cover"
                />
                <figcaption className="tag absolute bottom-0 left-0 bg-ink/85 px-4 py-2 text-white/80">
                  <span className="text-accent-bright">Fig. 02</span> — Pembangkit listrik tenaga surya
                </figcaption>
              </figure>
            </div>
            <div className="lg:col-span-5">
              <p className="text-[16px] leading-relaxed text-white/75">{renewable.body[1]}</p>
              <table className="mt-10 w-full border-collapse text-left">
                <caption className="tag mb-3 text-left text-white/50">Paket komponen PLTS</caption>
                <tbody>
                  {renewable.components.map((c, i) => (
                    <tr key={c.name} className="border-t border-line-inv">
                      <td className="tag w-12 py-4 align-top text-[#8fbaf3]">{pad(i + 1)}</td>
                      <th scope="row" className="py-4 pr-4 align-top text-[17px] font-normal">
                        {c.name}
                      </th>
                      <td className="py-4 align-top text-[14px] text-white/60">{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-10">
                <ButtonLink href="/rfq?kategori=Renewable%20Energy%20%2F%20PLTS" variant="ghost-inv">
                  Diskusikan kebutuhan PLTS
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 05 PERALATAN TEKNIK ───────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="wrap">
          <SectionHead
            index="05"
            label="Peralatan Penunjang Teknik"
            title="Mekanikal, elektrikal, dan instrumentasi untuk operasi pabrik."
          />
          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
            {technical.map((g, i) => (
              <div key={g.id}>
                <div className="flex items-baseline justify-between border-t-2 border-ink pt-5">
                  <h3 className="text-[22px] tracking-[-0.01em]">{g.title}</h3>
                  <span className="tag text-muted">{pad(i + 1)}</span>
                </div>
                <ul className="mt-6">
                  {g.lines.map((l) => (
                    <li key={l.name} className="border-b border-line py-3 text-[15px]">
                      {l.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/produk" className="link-arrow text-[15px] text-brand">
              Lihat katalog lengkap
              <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 06 PROSES ───────────────────────── */}
      <section id="proses" className="border-t border-line bg-paper-2/60 py-24 md:py-32">
        <div className="wrap">
          <SectionHead
            index="06"
            label="Alur Pengadaan"
            title="Dari spesifikasi sampai ke site proyek."
            intro="Setiap permintaan melewati empat tahap yang sama — supaya barang yang tiba adalah barang yang Anda minta, pada waktu yang Anda butuhkan."
          />

          <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-0">
            <span aria-hidden="true" className="absolute left-0 right-0 top-[7px] hidden h-px bg-ink md:block" />
            {processSteps.map((s, i) => (
              <li key={s.title} className="relative pl-8 md:pl-0 md:pr-8">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1 block h-[15px] w-[15px] rounded-full border-2 border-ink md:static ${
                    i === processSteps.length - 1 ? "bg-accent border-accent" : "bg-paper"
                  }`}
                />
                {i < processSteps.length - 1 ? (
                  <span aria-hidden="true" className="absolute left-[7px] top-6 bottom-[-2.5rem] w-px bg-ink md:hidden" />
                ) : null}
                <p className="tag text-muted md:mt-8">Tahap {pad(i + 1)}</p>
                <h3 className="mt-2 text-[24px] tracking-[-0.015em]">{s.title}</h3>
                <p className="mt-2 max-w-[28ch] text-[15px] leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────────────────── 07 NILAI ───────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="wrap">
          <SectionHead index="07" label="Nilai yang Kami Tawarkan" title="Alasan klien kembali ke meja kami." />
          <div className="mt-16 grid border-l border-t border-line sm:grid-cols-2">
            {values.map((v, i) => (
              <div key={v.title} className="border-b border-r border-line p-7 md:p-10">
                <span className="tag text-accent">{pad(i + 1)}</span>
                <h3 className="mt-6 text-[clamp(1.5rem,2.4vw,2rem)] leading-tight tracking-[-0.02em]">{v.title}</h3>
                <p className="mt-3 max-w-[40ch] text-[16px] leading-relaxed text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── 08 SEKTOR ───────────────────────── */}
      <section className="border-t border-line bg-paper-2/60 py-24 md:py-32">
        <div className="wrap">
          <SectionHead
            index="08"
            label="Sektor Pasar & Industri"
            title="Siapa yang kami layani, dan apa yang mereka butuhkan."
          />

          {/* Desktop: tabel */}
          <div className="mt-16 hidden md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="tag border-b border-ink text-muted">
                  <th scope="col" className="w-[30%] pb-4 font-normal">Kategori industri</th>
                  <th scope="col" className="w-[40%] pb-4 font-normal">Kebutuhan utama pengadaan</th>
                  <th scope="col" className="pb-4 font-normal">Fokus layanan MIP</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map((s) => (
                  <tr key={s.name} className="border-b border-line align-top">
                    <th scope="row" className="py-6 pr-6 text-[20px] font-normal tracking-[-0.01em]">
                      {s.name}
                    </th>
                    <td className="py-6 pr-6 text-[16px] leading-relaxed text-muted">{s.needs}</td>
                    <td className="py-6 text-[16px]">{s.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: daftar */}
          <dl className="mt-12 md:hidden">
            {sectors.map((s) => (
              <div key={s.name} className="border-t border-line py-6">
                <dt className="text-[20px] tracking-[-0.01em]">{s.name}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-muted">{s.needs}</dd>
                <dd className="tag mt-3 text-brand">{s.service}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <section className="relative overflow-hidden bg-brand text-white">
        <Image
          src="/photos/pipes.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25 mix-blend-luminosity"
        />
        <div className="wrap relative grid gap-10 py-20 md:grid-cols-12 md:items-end md:py-28">
          <div className="md:col-span-8">
            <p className="tag text-white/70">Request for Quotation</p>
            <h2 className="mt-5 text-h2 max-w-[20ch]">
              Kirim spesifikasi Anda. Kami siapkan penawarannya.
            </h2>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-white/80">
              Sertakan daftar barang, kuantitas, dan standar yang dibutuhkan. Tim kami akan menindaklanjuti
              melalui email atau telepon.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 md:col-span-4 md:items-end">
            <Link
              href="/rfq"
              className="link-arrow rounded-[2px] bg-white px-6 py-4 text-[16px] text-ink transition-colors hover:bg-paper"
            >
              Ajukan RFQ sekarang
              <Arrow />
            </Link>
            <a href={`mailto:${company.email}`} className="text-[15px] text-white/80 underline underline-offset-4 hover:text-white">
              atau email {company.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
