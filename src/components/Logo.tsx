type MarkProps = { className?: string; title?: string; mono?: boolean; onDark?: boolean };

/**
 * Logo mark "M" — rekonstruksi vektor dari logo PT. Meta Inti Persada.
 * Empat pita (ribbon) yang saling melipat; urutan gambar menentukan lipatan.
 */
export function LogoMark({ className, title = "Meta Inti Persada", mono = false, onDark = false }: MarkProps) {
  const c = mono
    ? { a: "currentColor", b: "currentColor", c: "currentColor", d: "currentColor" }
    : onDark
      ? // Di latar gelap, pita navy dinaikkan sedikit agar huruf M tetap terbaca utuh.
        { a: "#1F5ACC", b: "#2D6FE6", c: "#173E8F", d: "#3A8CF0" }
      : { a: "#1B52BF", b: "#2667DD", c: "#0B2A6B", d: "#1A7BE8" };
  return (
    <svg viewBox="0 0 210 100" className={className} role="img" aria-label={title}>
      <polygon points="0,100 34,100 78,0 44,0" fill={c.a} opacity={mono ? 0.75 : 1} />
      <polygon points="88,100 122,100 166,0 132,0" fill={c.c} opacity={mono ? 0.55 : 1} />
      <polygon points="44,0 80,0 124,100 88,100" fill={c.b} />
      <polygon points="132,0 166,0 210,100 176,100" fill={c.d} opacity={mono ? 0.9 : 1} />
    </svg>
  );
}

export function Logo({ inverted = false, className = "" }: { inverted?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-[22px] w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={`text-[15px] font-bold tracking-[0.06em] ${inverted ? "text-white" : "text-ink"}`}
        >
          META INTI PERSADA
        </span>
        <span
          className={`mt-1 font-mono text-[9px] uppercase tracking-[0.08em] ${
            inverted ? "text-white/55" : "text-muted"
          }`}
        >
          Reliable Supply for Industrial Solutions
        </span>
      </span>
    </span>
  );
}
