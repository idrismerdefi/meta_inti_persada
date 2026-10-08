/**
 * Gambar teknik: tampak memanjang pipeline crossing di bawah jalan.
 * Carrier pipe ditopang casing spacer di dalam casing pipe, ujung ditutup end seal.
 */

const SPACERS = [235, 345, 455, 565, 675];

function Callout({
  x,
  y,
  tx,
  ty,
  label,
  anchor = "start",
}: {
  x: number;
  y: number;
  tx: number;
  ty: number;
  label: string;
  anchor?: "start" | "end";
}) {
  const end = anchor === "start" ? tx + 18 : tx - 18;
  return (
    <g>
      <circle cx={x} cy={y} r="2.6" fill="#0e1726" />
      <polyline points={`${x},${y} ${tx},${ty} ${end},${ty}`} fill="none" stroke="#0e1726" strokeWidth="0.9" />
      <text
        x={anchor === "start" ? end + 6 : end - 6}
        y={ty + 3.5}
        textAnchor={anchor}
        className="font-mono"
        fontSize="10.5"
        letterSpacing="1.1"
        fill="#0e1726"
      >
        {label}
      </text>
    </g>
  );
}

export function PipelineCrossing({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 390"
      className={className}
      role="img"
      aria-label="Gambar tampak memanjang pipeline crossing: carrier pipe di dalam casing pipe di bawah jalan, ditopang casing spacer"
    >
      <defs>
        <pattern id="pc-soil" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="rgb(14 23 38 / 0.09)" strokeWidth="1" />
        </pattern>
        <pattern id="pc-wall" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="rgb(14 23 38 / 0.55)" strokeWidth="0.8" />
        </pattern>
        <marker id="pc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 1 L10 5 L0 9 Z" fill="#0e1726" />
        </marker>
      </defs>

      {/* Tanah */}
      <rect x="0" y="120" width="900" height="270" fill="url(#pc-soil)" />
      <line x1="0" y1="120" x2="900" y2="120" stroke="#0e1726" strokeWidth="1.2" />

      {/* Jalan */}
      <polygon points="215,120 255,104 645,104 685,120" fill="#0e1726" />
      <g stroke="#f2f3f0" strokeWidth="2">
        {[290, 345, 400, 455, 510, 565].map((x) => (
          <line key={x} x1={x} y1="112" x2={x + 26} y2="112" />
        ))}
      </g>
      <text x="450" y="80" textAnchor="middle" className="font-mono" fontSize="10.5" letterSpacing="1.4" fill="#5a6577">
        CROSSING — JALAN · REL KERETA · SUNGAI
      </text>

      {/* Sumbu pipa */}
      <line x1="10" y1="240" x2="890" y2="240" stroke="rgb(14 23 38 / 0.35)" strokeWidth="0.8" strokeDasharray="20 4 3 4" />

      {/* Casing pipe */}
      <rect x="170" y="190" width="560" height="8" fill="url(#pc-wall)" />
      <rect x="170" y="282" width="560" height="8" fill="url(#pc-wall)" />
      <rect x="170" y="190" width="560" height="100" fill="none" stroke="#0e1726" strokeWidth="1.3" />
      <line x1="170" y1="198" x2="730" y2="198" stroke="#0e1726" strokeWidth="0.9" />
      <line x1="170" y1="282" x2="730" y2="282" stroke="#0e1726" strokeWidth="0.9" />

      {/* End seal */}
      <polygon points="170,198 128,214 128,266 170,282" fill="#5a6577" opacity="0.55" stroke="#0e1726" strokeWidth="0.9" />
      <polygon points="730,198 772,214 772,266 730,282" fill="#5a6577" opacity="0.55" stroke="#0e1726" strokeWidth="0.9" />

      {/* Carrier pipe */}
      <rect x="20" y="215" width="860" height="50" fill="#f2f3f0" />
      <line x1="20" y1="215" x2="880" y2="215" stroke="#0e1726" strokeWidth="1.3" />
      <line x1="20" y1="265" x2="880" y2="265" stroke="#0e1726" strokeWidth="1.3" />
      <line x1="20" y1="220" x2="880" y2="220" stroke="rgb(14 23 38 / 0.35)" strokeWidth="0.8" />
      <line x1="20" y1="260" x2="880" y2="260" stroke="rgb(14 23 38 / 0.35)" strokeWidth="0.8" />
      <line x1="10" y1="240" x2="890" y2="240" stroke="rgb(14 23 38 / 0.35)" strokeWidth="0.8" strokeDasharray="20 4 3 4" />
      {/* potongan ujung pipa */}
      <path d="M20 215 q -8 12.5 0 25 q 8 12.5 0 25" fill="none" stroke="#0e1726" strokeWidth="1" />
      <path d="M880 215 q -8 12.5 0 25 q 8 12.5 0 25" fill="none" stroke="#0e1726" strokeWidth="1" />

      {/* Casing spacer */}
      {SPACERS.map((x) => (
        <g key={x} fill="#2464db">
          <rect x={x - 5} y="211" width="10" height="58" />
          <rect x={x - 2.5} y="205" width="5" height="6" />
          <rect x={x - 10} y="200.5" width="20" height="5" rx="1" />
          <rect x={x - 2.5} y="269" width="5" height="6" />
          <rect x={x - 10} y="274.5" width="20" height="5" rx="1" />
        </g>
      ))}

      {/* Dimensi jarak spacer */}
      <g stroke="#0e1726" strokeWidth="0.8">
        <line x1="345" y1="294" x2="345" y2="330" />
        <line x1="455" y1="294" x2="455" y2="330" />
      </g>
      <line x1="347" y1="322" x2="453" y2="322" stroke="#0e1726" strokeWidth="0.9" markerStart="url(#pc-arrow)" markerEnd="url(#pc-arrow)" />
      <text x="400" y="348" textAnchor="middle" className="font-mono" fontSize="10.5" letterSpacing="1.1" fill="#0e1726">
        JARAK SESUAI DESAIN
      </text>

      {/* Callout */}
      <Callout x={200} y={190} tx={200} ty={155} label="CASING PIPE" />
      <Callout x={565} y={203} tx={565} ty={155} label="CASING SPACER" />
      <Callout x={760} y={226} tx={790} ty={170} label="END SEAL" />
      <Callout x={820} y={265} tx={820} ty={330} label="CARRIER PIPE" anchor="end" />
    </svg>
  );
}
