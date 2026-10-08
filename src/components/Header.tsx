import Link from "next/link";
import { Logo } from "./Logo";
import { Arrow } from "./ui";
import { MobileNav } from "./MobileNav";

const nav = [
  { href: "/#profil", label: "Profil" },
  { href: "/#lini-bisnis", label: "Lini Bisnis" },
  { href: "/#casing-spacer", label: "Casing Spacer" },
  { href: "/#plts", label: "PLTS" },
  { href: "/#proses", label: "Proses" },
  { href: "/produk", label: "Katalog" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-md supports-[backdrop-filter]:bg-paper/80">
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Beranda PT. Meta Inti Persada" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-[14px] text-ink/75 transition-colors hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/rfq"
            className="link-arrow hidden rounded-[2px] bg-ink px-4 py-2.5 text-[14px] text-white transition-colors hover:bg-accent sm:inline-flex"
          >
            Ajukan RFQ
            <Arrow className="h-3 w-3" />
          </Link>

          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
