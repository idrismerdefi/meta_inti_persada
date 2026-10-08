/**
 * Gambar teknik: potongan melintang casing spacer (carrier pipe di dalam casing).
 * Ilustrasi orisinal — vektor, ringan, tajam di semua ukuran layar.
 */

const CX = 300;
const CY = 300;

function ring(r1: number, r2: number) {
  // Dua lingkaran dalam satu path; fill-rule evenodd menghasilkan cincin.
  const c = (r: number) =>
    `M ${CX - r} ${CY} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
  return `${c(r2)} ${c(r1)}`;
}

function polar(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as const;
}

const RUNNER_ANGLES = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

const callouts = [
  { n: "01", label: "CASING PIPE", at: polar(194, -36), elbow: [495, 150] },
  { n: "02", label: "RUNNER", at: polar(174, -22.5), elbow: [495, 236] },
  { n: "03", label: "SPACER BAND", at: polar(117, 22), elbow: [495, 392] },
  { n: "04", label: "CARRIER PIPE", at: polar(107, 52), elbow: [495, 462] },
];

export function CasingSpacerSection({ className }: { className?: string }) {
  const [dx1, dy1] = polar(112, 205);
  const [dx2, dy2] = polar(112, 25);

  return (
    <svg
      viewBox="0 0 700 600"
      className={className}
      role="img"
      aria-label="Gambar potongan melintang casing spacer: carrier pipe ditopang runner di dalam casing pipe"
    >
      <defs>
        <pattern id="cs-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="rgb(255 255 255 / 0.32)" strokeWidth="1" />
        </pattern>
        <marker id="cs-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 1 L10 5 L0 9 Z" fill="rgb(255 255 255 / 0.7)" />
        </marker>
      </defs>

      {/* Garis sumbu */}
      <g stroke="rgb(255 255 255 / 0.28)" strokeWidth="1" strokeDasharray="22 5 3 5">
        <line x1={CX - 250} y1={CY} x2={CX + 250} y2={CY} />
        <line x1={CX} y1={CY - 250} x2={CX} y2={CY + 250} />
      </g>

      {/* Casing pipe */}
      <path d={ring(186, 200)} fill="url(#cs-hatch)" fillRule="evenodd" />
      <circle cx={CX} cy={CY} r="200" fill="none" stroke="rgb(255 255 255 / 0.75)" strokeWidth="1.5" />
      <circle cx={CX} cy={CY} r="186" fill="none" stroke="rgb(255 255 255 / 0.75)" strokeWidth="1.2" />

      {/* Runner + riser */}
      <g>
        {RUNNER_ANGLES.map((a) => (
          <g key={a} transform={`translate(${CX} ${CY}) rotate(${a})`}>
            <rect x="-6" y="-168" width="12" height="47" fill="#1a7be8" opacity="0.55" />
            <rect x="-17" y="-180" width="34" height="12" rx="1.5" fill="#1a7be8" stroke="#7fb4f5" strokeWidth="1" />
          </g>
        ))}
      </g>

      {/* Spacer band */}
      <path d={ring(112, 122)} fill="#1a7be8" fillRule="evenodd" />
      <circle cx={CX} cy={CY} r="122" fill="none" stroke="#7fb4f5" strokeWidth="1" />

      {/* Carrier pipe */}
      <path d={ring(100, 112)} fill="url(#cs-hatch)" fillRule="evenodd" />
      <circle cx={CX} cy={CY} r="112" fill="none" stroke="rgb(255 255 255 / 0.85)" strokeWidth="1.5" />
      <circle cx={CX} cy={CY} r="100" fill="none" stroke="rgb(255 255 255 / 0.85)" strokeWidth="1.2" />

      {/* Dimensi Ø casing */}
      <g stroke="rgb(255 255 255 / 0.45)" strokeWidth="1">
        <line x1={CX - 200} y1={CY - 6} x2={CX - 200} y2={42} />
        <line x1={CX + 200} y1={CY - 6} x2={CX + 200} y2={42} />
      </g>
      <line
        x1={CX - 198}
        y1={54}
        x2={CX + 198}
        y2={54}
        stroke="rgb(255 255 255 / 0.7)"
        strokeWidth="1"
        markerStart="url(#cs-arrow)"
        markerEnd="url(#cs-arrow)"
      />
      <rect x={CX - 52} y={44} width="104" height="20" fill="#1b2533" />
      <text x={CX} y={58} textAnchor="middle" className="cs-d font-mono" fontSize="11" letterSpacing="1.5" fill="white">
        Ø CASING
      </text>

      {/* Dimensi Ø carrier */}
      <line
        x1={dx1}
        y1={dy1}
        x2={dx2}
        y2={dy2}
        stroke="rgb(255 255 255 / 0.7)"
        strokeWidth="1"
        markerStart="url(#cs-arrow)"
        markerEnd="url(#cs-arrow)"
      />
      <g transform={`translate(${CX} ${CY}) rotate(25)`}>
        <rect x="-44" y="-26" width="88" height="17" fill="#1b2533" />
        <text x="0" y="-13" textAnchor="middle" className="cs-d font-mono" fontSize="11" letterSpacing="1.5" fill="white">
          Ø CARRIER
        </text>
      </g>

      {/* Callout */}
      <g className="cs-t font-mono" fontSize="11" letterSpacing="1.2">
        {callouts.map((c) => (
          <g key={c.n}>
            <circle cx={c.at[0]} cy={c.at[1]} r="3" fill="white" />
            <polyline
              points={`${c.at[0]},${c.at[1]} ${c.elbow[0]},${c.elbow[1]} ${c.elbow[0] + 24},${c.elbow[1]}`}
              fill="none"
              stroke="rgb(255 255 255 / 0.6)"
              strokeWidth="1"
            />
            <text x={c.elbow[0] + 32} y={c.elbow[1] + 4} fill="white">
              <tspan fill="#7fb4f5">{c.n}</tspan>
              {"\u00a0\u00a0"}
              {c.label}
            </text>
          </g>
        ))}
      </g>

      {/* Title block */}
      <g className="cs-tb font-mono" fontSize="10" letterSpacing="1.2" fill="rgb(255 255 255 / 0.7)">
        <rect x="20" y="548" width="660" height="40" fill="none" stroke="rgb(255 255 255 / 0.3)" />
        <line x1="130" y1="548" x2="130" y2="588" stroke="rgb(255 255 255 / 0.3)" />
        <line x1="560" y1="548" x2="560" y2="588" stroke="rgb(255 255 255 / 0.3)" />
        <text x="34" y="572">DETAIL A</text>
        <text x="146" y="572">CASING SPACER — POTONGAN MELINTANG</text>
        <text x="576" y="572">SKALA NTS</text>
      </g>
    </svg>
  );
}
