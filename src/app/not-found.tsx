import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="drafting-grid-light py-28 md:py-40">
      <div className="wrap">
        <p className="tag text-muted">
          <span className="text-brand">404</span>
          <span className="mx-2 opacity-50">/</span>Halaman tidak ditemukan
        </p>
        <h1 className="mt-6 text-display max-w-[14ch]">Jalur ini tidak tersambung.</h1>
        <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-muted">
          Halaman yang Anda cari mungkin sudah dipindahkan. Kembali ke beranda atau langsung kirim kebutuhan Anda.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Ke beranda</ButtonLink>
          <ButtonLink href="/rfq" variant="brand">
            Ajukan RFQ
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
