"use client";

import Link from "next/link";
import { useRef } from "react";
import { Arrow } from "./ui";

type Item = { href: string; label: string };

/** Menu mobile berbasis <details>: tetap berfungsi tanpa JS, dan menutup sendiri setelah link diklik. */
export function MobileNav({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (ref.current) ref.current.open = false;
  };

  return (
    <details ref={ref} className="group relative lg:hidden">
      <summary
        className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-[2px] border border-line [&::-webkit-details-marker]:hidden"
        aria-label="Menu"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4 group-open:hidden" aria-hidden="true">
          <path d="M2 6h16M2 14h16" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <svg viewBox="0 0 20 20" className="hidden h-4 w-4 group-open:block" aria-hidden="true">
          <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      <nav
        aria-label="Navigasi mobile"
        className="absolute right-0 top-12 w-[min(86vw,320px)] border border-line bg-paper p-2 shadow-[0_20px_40px_-20px_rgb(14_23_38/0.35)]"
      >
        {items.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            onClick={close}
            className="flex items-center justify-between border-b border-line px-3 py-3.5 text-[15px] last:border-0"
          >
            {n.label}
            <Arrow className="h-3 w-3 text-muted" />
          </Link>
        ))}
        <Link href="/rfq" onClick={close} className="mt-2 flex items-center justify-between bg-ink px-3 py-3.5 text-[15px] text-white">
          Ajukan RFQ
          <Arrow className="h-3 w-3" />
        </Link>
      </nav>
    </details>
  );
}
