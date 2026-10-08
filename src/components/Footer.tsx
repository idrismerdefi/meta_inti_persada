import Link from "next/link";
import { getContent } from "@/lib/cms";
import { LogoMark } from "./Logo";

export async function Footer() {
  const company = await getContent("company");
  const year = new Date().getFullYear();
  return (
    <footer className="bg-steel text-white">
      <div className="wrap pt-20 pb-10 md:pt-28">
        <p className="tag text-white/50">{company.tagline}</p>
        <p className="mt-5 max-w-[16ch] text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] tracking-[-0.035em]">
          Building reliable industrial partnerships.
        </p>

        <div className="mt-16 grid gap-10 border-t border-line-inv pt-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <LogoMark className="h-7 w-auto" onDark />
            <p className="mt-5 text-[15px] font-bold tracking-[0.06em]">PT. META INTI PERSADA</p>
            <p className="mt-2 max-w-[34ch] text-[14px] leading-relaxed text-white/60">{company.positioning}</p>
          </div>

          <div className="md:col-span-3">
            <p className="tag text-white/45">Kantor</p>
            <address className="mt-3 text-[15px] not-italic leading-relaxed text-white/85">
              {company.address.building}
              <br />
              {company.address.area}
            </address>
            <a
              href={company.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[14px] text-brand-bright underline-offset-4 hover:underline"
            >
              Buka di Google Maps
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="tag text-white/45">Kontak</p>
            <a
              href={`mailto:${company.email}`}
              className="mt-3 block break-all text-[15px] text-white/85 underline-offset-4 hover:underline"
            >
              {company.email}
            </a>
            <Link href="/rfq" className="mt-3 inline-block text-[14px] text-brand-bright underline-offset-4 hover:underline">
              Kirim Request for Quotation
            </Link>
          </div>

          <nav aria-label="Navigasi footer" className="md:col-span-2">
            <p className="tag text-white/45">Halaman</p>
            <ul className="mt-3 space-y-2 text-[15px] text-white/85">
              <li><Link href="/" className="hover:text-white">Beranda</Link></li>
              <li><Link href="/produk" className="hover:text-white">Katalog Produk</Link></li>
              <li><Link href="/rfq" className="hover:text-white">Ajukan RFQ</Link></li>
            </ul>
          </nav>
        </div>

        <div className="tag mt-16 flex flex-col justify-between gap-3 border-t border-line-inv pt-6 text-white/40 sm:flex-row">
          <span>© {year} PT. Meta Inti Persada</span>
          <span>Jakarta · Indonesia</span>
        </div>
      </div>
    </footer>
  );
}
