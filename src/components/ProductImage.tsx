"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** Thumbnail produk; diklik membuka popup zoom dengan tombol tutup di pojok kanan atas. */
export function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const unoptimized = src.startsWith("/media/");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Perbesar foto ${alt}`}
        className="relative block h-full w-full cursor-zoom-in"
      >
        <Image src={src} alt={alt} fill sizes="96px" unoptimized={unoptimized} className="object-cover" />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 md:p-10"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative h-[80vh] w-full max-w-4xl bg-ink">
            <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 896px, 100vw" unoptimized={unoptimized} className="object-contain" />
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-[22px] leading-none text-white hover:bg-black"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
