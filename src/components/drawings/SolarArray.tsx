/**
 * Gambar teknik: susunan modul surya di atas mounting, tersambung ke inverter dan BESS.
 */

const COLS = 4;
const ROWS = 3;
const W = 92; // lebar modul
const SKEW = 30; // geser horizontal sisi belakang
const H = 44; // tinggi modul (proyeksi)

function origin(i: number, j: number) {
  return [36 + i * (W + 8) + j * 44, 352 - j * 76] as const;
}

export function SolarArray({ className }: { className?: string }) {
  const panels: { i: number; j: number }[] = [];
  for (let j = ROWS - 1; j >= 0; j--) for (let i = 0; i < COLS; i++) panels.push({ i, j });

  return (
    <svg
      viewBox="0 0 720 440"
      className={className}
      role="img"
      aria-label="Gambar susunan solar panel di atas mounting system, tersambung ke inverter dan battery energy storage system"
    >
      <defs>
        <marker id="sa-dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
          <circle cx="5" cy="5" r="4" fill="#7fb4f5" />
        </marker>
      </defs>

      {panels.map(({ i, j }) => {
        const [x, y] = origin(i, j);
        const p = [
          [x, y],
          [x + W, y],
          [x + W + SKEW, y - H],
          [x + SKEW, y - H],
        ];
        const cellsU = Array.from({ length: 5 }, (_, k) => (k + 1) / 6);
        const cellsV = Array.from({ length: 3 }, (_, k) => (k + 1) / 4);
        return (
          <g key={`${i}-${j}`}>
            {/* kaki mounting */}
            <g stroke="rgb(255 255 255 / 0.45)" strokeWidth="1">
              <line x1={x + 8} y1={y} x2={x + 8} y2={y + 16} />
              <line x1={x + W - 8} y1={y} x2={x + W - 8} y2={y + 16} />
              <line x1={x + SKEW + 8} y1={y - H} x2={x + SKEW + 8} y2={y + 16 - 10} />
              <line x1={x + W + SKEW - 8} y1={y - H} x2={x + W + SKEW - 8} y2={y + 16 - 10} />
            </g>
            <polygon
              points={p.map((q) => q.join(",")).join(" ")}
              fill="rgb(26 123 232 / 0.22)"
              stroke="rgb(255 255 255 / 0.85)"
              strokeWidth="1.1"
            />
            <g stroke="rgb(255 255 255 / 0.25)" strokeWidth="0.7">
              {cellsU.map((t) => (
                <line key={`u${t}`} x1={x + W * t} y1={y} x2={x + W * t + SKEW} y2={y - H} />
              ))}
              {cellsV.map((t) => (
                <line key={`v${t}`} x1={x + SKEW * t} y1={y - H * t} x2={x + W + SKEW * t} y2={y - H * t} />
              ))}
            </g>
          </g>
        );
      })}

      {/* rel mounting depan */}
      <line x1="36" y1="368" x2={36 + COLS * (W + 8) - 8} y2="368" stroke="rgb(255 255 255 / 0.45)" strokeWidth="1" />

      {/* kabel DC ke inverter */}
      <polyline
        points="430,330 530,330 530,250 590,250"
        fill="none"
        stroke="#7fb4f5"
        strokeWidth="1.2"
        strokeDasharray="5 4"
        markerStart="url(#sa-dot)"
      />
      {/* inverter */}
      <rect x="590" y="210" width="76" height="92" fill="none" stroke="rgb(255 255 255 / 0.85)" strokeWidth="1.2" />
      <rect x="602" y="224" width="52" height="22" fill="none" stroke="rgb(255 255 255 / 0.4)" />
      <path d="M606 268 q 8 -10 16 0 t 16 0 t 16 0" fill="none" stroke="#7fb4f5" strokeWidth="1.2" />
      {/* inverter ke BESS */}
      <line x1="628" y1="302" x2="628" y2="336" stroke="#7fb4f5" strokeWidth="1.2" strokeDasharray="5 4" />
      <rect x="580" y="336" width="96" height="58" fill="none" stroke="rgb(255 255 255 / 0.85)" strokeWidth="1.2" />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={590 + k * 21} y="348" width="15" height="34" fill="rgb(26 123 232 / 0.35)" stroke="rgb(255 255 255 / 0.5)" />
      ))}

      <g className="font-mono" fontSize="10.5" letterSpacing="1.2" fill="white">
        <text x="36" y="40">SOLAR PANEL ARRAY</text>
        <line x1="36" y1="48" x2="160" y2="48" stroke="rgb(255 255 255 / 0.4)" />
        <line x1="160" y1="48" x2="190" y2="140" stroke="rgb(255 255 255 / 0.4)" />
        <circle cx="190" cy="140" r="2.6" fill="white" />

        <text x="36" y="408">MOUNTING SYSTEM</text>
        <line x1="70" y1="396" x2="70" y2="370" stroke="rgb(255 255 255 / 0.4)" />

        <text x="590" y="196">INVERTER</text>
        <text x="580" y="414">BESS</text>
      </g>
    </svg>
  );
}
