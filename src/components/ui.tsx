import Link from "next/link";
import type { ReactNode } from "react";

export function Arrow({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Kepala section: nomor + label mono di kiri, judul besar di kanan. */
export function SectionHead({
  index,
  label,
  title,
  intro,
  inverted = false,
}: {
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  inverted?: boolean;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-12 md:gap-8">
      <div className={`tag md:col-span-3 ${inverted ? "text-white/55" : "text-muted"}`}>
        <span className={inverted ? "text-accent-bright" : "text-accent"}>{index}</span>
        <span className="mx-2 opacity-50">/</span>
        {label}
      </div>
      <div className="md:col-span-9">
        <h2 className={`text-h2 max-w-[18ch] ${inverted ? "text-white" : "text-ink"}`}>{title}</h2>
        {intro ? (
          <p
            className={`mt-6 max-w-[58ch] text-[17px] leading-relaxed ${
              inverted ? "text-white/70" : "text-muted"
            }`}
          >
            {intro}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "brand" | "ghost-inv";
}) {
  const styles = {
    solid: "bg-ink text-white hover:bg-brand-deep",
    brand: "bg-accent text-white hover:bg-accent-deep",
    "ghost-inv": "border border-white/30 text-white hover:border-white hover:bg-white/5",
  }[variant];
  return (
    <Link
      href={href}
      className={`link-arrow rounded-[2px] px-5 py-3.5 text-[15px] transition-colors ${styles}`}
    >
      {children}
      <Arrow />
    </Link>
  );
}
