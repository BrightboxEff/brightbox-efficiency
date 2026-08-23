const MOSS = "#4A5D3A";
const GOLD = "#C9962B";
const CHARCOAL = "#2B2B25";

export default function SolarFlowDiagram() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-muted bg-white p-4 sm:p-6">
      <svg viewBox="0 0 640 300" className="mx-auto w-full max-w-2xl" role="img" aria-label="Diagram showing sunlight hitting solar panels, converted to usable electricity by an inverter, then powering your home, charging a battery, or exporting to the grid for payment.">
        {/* Sun */}
        <g>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x1 = 70 + Math.cos(angle) * 34;
            const y1 = 70 + Math.sin(angle) * 34;
            const x2 = 70 + Math.cos(angle) * 44;
            const y2 = 70 + Math.sin(angle) * 44;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={GOLD}
                strokeWidth={3}
                strokeLinecap="round"
                className="sun-ray"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            );
          })}
          <circle cx={70} cy={70} r={26} fill={GOLD} />
        </g>

        {/* Panel glow (sunlight hitting the roof) */}
        <ellipse cx={220} cy={140} rx={90} ry={60} fill={GOLD} className="panel-glow" />

        {/* Solar panel */}
        <g>
          <rect x={160} y={110} width={120} height={60} rx={4} fill="none" stroke={CHARCOAL} strokeWidth={2} />
          {[1, 2, 3].map((i) => (
            <line key={`v${i}`} x1={160 + i * 30} y1={110} x2={160 + i * 30} y2={170} stroke={CHARCOAL} strokeWidth={1} />
          ))}
          <line x1={160} y1={140} x2={280} y2={140} stroke={CHARCOAL} strokeWidth={1} />
          <text x={220} y={195} textAnchor="middle" fontSize={13} fill={CHARCOAL} fontWeight={600}>
            Solar panels
          </text>
        </g>

        {/* Panel -> Inverter (DC) */}
        <path d="M 280 140 L 335 140" fill="none" stroke={GOLD} strokeWidth={3} strokeLinecap="round" className="flow-wire" />

        {/* Inverter */}
        <g>
          <rect x={335} y={115} width={70} height={50} rx={6} fill="none" stroke={CHARCOAL} strokeWidth={2} />
          <text x={370} y={144} textAnchor="middle" fontSize={11} fill={CHARCOAL} fontWeight={600}>
            Inverter
          </text>
          <text x={370} y={195} textAnchor="middle" fontSize={11} fill={CHARCOAL} className="hidden sm:block">
            DC → AC
          </text>
        </g>

        {/* Inverter -> House */}
        <path d="M 405 125 C 450 100, 470 70, 505 62" fill="none" stroke={MOSS} strokeWidth={3} strokeLinecap="round" className="flow-wire" style={{ animationDelay: "0.15s" }} />
        {/* Inverter -> Battery */}
        <path d="M 405 140 L 505 140" fill="none" stroke={MOSS} strokeWidth={3} strokeLinecap="round" className="flow-wire" style={{ animationDelay: "0.3s" }} />
        {/* Inverter -> Grid */}
        <path d="M 405 155 C 450 180, 470 210, 505 220" fill="none" stroke={GOLD} strokeWidth={3} strokeLinecap="round" className="flow-wire" style={{ animationDelay: "0.45s" }} />

        {/* House */}
        <g>
          <path d="M 505 62 L 530 42 L 555 62 L 555 90 L 505 90 Z" fill="none" stroke={MOSS} strokeWidth={2} strokeLinejoin="round" />
          <text x={530} y={108} textAnchor="middle" fontSize={12} fill={CHARCOAL} fontWeight={600}>
            Your home
          </text>
        </g>

        {/* Battery */}
        <g>
          <rect x={505} y={124} width={50} height={32} rx={4} fill="none" stroke={MOSS} strokeWidth={2} />
          <rect x={553} y={133} width={5} height={14} rx={1} fill={MOSS} />
          <line x1={523} y1={132} x2={523} y2={148} stroke={MOSS} strokeWidth={2} />
          <line x1={514} y1={140} x2={532} y2={140} stroke={MOSS} strokeWidth={2} />
          <line x1={538} y1={140} x2={548} y2={140} stroke={MOSS} strokeWidth={2} />
          <text x={530} y={172} textAnchor="middle" fontSize={12} fill={CHARCOAL} fontWeight={600}>
            Battery
          </text>
        </g>

        {/* Grid */}
        <g>
          <line x1={530} y1={200} x2={530} y2={240} stroke={GOLD} strokeWidth={2} />
          <line x1={512} y1={210} x2={548} y2={210} stroke={GOLD} strokeWidth={2} />
          <line x1={516} y1={222} x2={544} y2={222} stroke={GOLD} strokeWidth={2} />
          <circle cx={530} cy={248} r={11} fill={GOLD} />
          <text x={530} y={252} textAnchor="middle" fontSize={12} fill="white" fontWeight={700}>
            £
          </text>
          <text x={530} y={272} textAnchor="middle" fontSize={12} fill={CHARCOAL} fontWeight={600}>
            The grid
          </text>
        </g>
      </svg>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-charcoal/60">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GOLD }} />
          Sunlight / raw DC power
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: MOSS }} />
          Usable AC power (home &amp; battery)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GOLD }} />
          Exported for payment
        </span>
      </div>
    </div>
  );
}
