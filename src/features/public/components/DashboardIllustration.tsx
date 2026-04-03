export function DashboardIllustration() {
  return (
    <svg
      viewBox="0 0 560 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      {/* Card bg */}
      <rect width="560" height="380" rx="16" fill="#0f172a" />

      {/* Top bar */}
      <rect x="0" y="0" width="560" height="44" rx="16" fill="#1e293b" />
      <rect x="16" y="14" width="8" height="8" rx="2" fill="#38bdf8" />
      <rect x="30" y="16" width="60" height="4" rx="2" fill="#334155" />
      <rect
        x="420"
        y="14"
        width="48"
        height="16"
        rx="8"
        fill="#0ea5e9"
        opacity="0.15"
      />
      <rect x="430" y="19" width="28" height="6" rx="3" fill="#38bdf8" />
      <circle
        cx="488"
        cy="22"
        r="10"
        fill="#1e293b"
        stroke="#334155"
        strokeWidth="1.5"
      />
      <circle cx="488" cy="19" r="4" fill="#475569" />
      <path d="M481 28 Q488 34 495 28" fill="#475569" />
      <circle
        cx="520"
        cy="22"
        r="10"
        fill="#1e293b"
        stroke="#334155"
        strokeWidth="1.5"
      />
      <rect x="515" y="18" width="10" height="2" rx="1" fill="#475569" />
      <rect x="515" y="22" width="10" height="2" rx="1" fill="#475569" />
      <rect x="515" y="26" width="6" height="2" rx="1" fill="#475569" />

      {/* Sidebar */}
      <rect x="0" y="44" width="140" height="336" fill="#0f172a" />
      <rect
        x="0"
        y="44"
        width="140"
        height="336"
        fill="#1e293b"
        opacity="0.4"
      />

      {/* Sidebar nav items */}
      {[
        { y: 64, label: 'Dashboard', active: true },
        { y: 94, label: 'Inventory', active: false },
        { y: 124, label: 'Purchase Req.', active: false },
        { y: 154, label: 'Stock Moves', active: false },
        { y: 184, label: 'Suppliers', active: false },
        { y: 214, label: 'Warehouses', active: false },
        { y: 244, label: 'Users', active: false },
      ].map((item) => (
        <g key={item.y}>
          {item.active && (
            <rect
              x="8"
              y={item.y - 4}
              width="124"
              height="24"
              rx="6"
              fill="#0ea5e9"
              opacity="0.15"
            />
          )}
          <rect
            x="16"
            y={item.y}
            width="8"
            height="8"
            rx="2"
            fill={item.active ? '#38bdf8' : '#334155'}
          />
          <rect
            x="30"
            y={item.y + 2}
            width={item.active ? 70 : 55}
            height="4"
            rx="2"
            fill={item.active ? '#7dd3fc' : '#475569'}
          />
        </g>
      ))}

      {/* Stat cards row */}
      {[
        { x: 156, color: '#0ea5e9' },
        { x: 272, color: '#10b981' },
        { x: 388, color: '#f59e0b' },
      ].map((card) => (
        <g key={card.x}>
          <rect
            x={card.x}
            y="56"
            width="100"
            height="72"
            rx="10"
            fill="#1e293b"
          />
          <rect
            x={card.x}
            y="56"
            width="100"
            height="3"
            rx="1.5"
            fill={card.color}
            opacity="0.8"
          />
          <rect
            x={card.x + 10}
            y="70"
            width="40"
            height="3"
            rx="1.5"
            fill="#475569"
          />
          <rect
            x={card.x + 10}
            y="82"
            width="55"
            height="8"
            rx="2"
            fill="#f1f5f9"
          />
          <rect
            x={card.x + 10}
            y="100"
            width="70"
            height="3"
            rx="1.5"
            fill="#334155"
          />
          <circle
            cx={card.x + 88}
            cy="74"
            r="8"
            fill={card.color}
            opacity="0.12"
          />
          <rect
            x={card.x + 84}
            y="70"
            width="8"
            height="8"
            rx="2"
            fill={card.color}
            opacity="0.6"
          />
        </g>
      ))}

      {/* Chart area */}
      <rect x="156" y="140" width="232" height="150" rx="10" fill="#1e293b" />
      <rect x="168" y="152" width="80" height="5" rx="2.5" fill="#e2e8f0" />
      <rect x="168" y="162" width="55" height="3" rx="1.5" fill="#475569" />

      {/* Bar chart */}
      {[
        { x: 172, h: 50 },
        { x: 192, h: 70 },
        { x: 212, h: 45 },
        { x: 232, h: 85 },
        { x: 252, h: 60 },
        { x: 272, h: 95 },
        { x: 292, h: 55 },
        { x: 312, h: 75 },
        { x: 332, h: 90 },
        { x: 352, h: 65 },
      ].map((bar, i) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={275 - bar.h}
          width="14"
          height={bar.h}
          rx="3"
          fill={i % 3 === 2 ? '#38bdf8' : '#0ea5e9'}
          opacity="0.7"
        />
      ))}

      {/* Grid lines */}
      {[180, 210, 240, 270].map((y) => (
        <line
          key={y}
          x1="168"
          y1={y}
          x2="376"
          y2={y}
          stroke="#334155"
          strokeWidth="0.5"
          strokeDasharray="3,3"
        />
      ))}

      {/* PR table */}
      <rect x="400" y="140" width="144" height="150" rx="10" fill="#1e293b" />
      <rect x="412" y="152" width="70" height="5" rx="2.5" fill="#e2e8f0" />
      {[
        { y: 172, status: '#10b981' },
        { y: 196, status: '#f59e0b' },
        { y: 220, status: '#10b981' },
        { y: 244, status: '#ef4444' },
        { y: 268, status: '#f59e0b' },
      ].map((row) => (
        <g key={row.y}>
          <rect
            x="412"
            y={row.y}
            width="55"
            height="3.5"
            rx="1.75"
            fill="#475569"
          />
          <rect
            x="476"
            y={row.y - 2}
            width="52"
            height="9"
            rx="4"
            fill={row.status}
            opacity="0.12"
          />
          <rect
            x="481"
            y={row.y}
            width="38"
            height="3.5"
            rx="1.75"
            fill={row.status}
            opacity="0.8"
          />
        </g>
      ))}

      {/* Bottom activity strip */}
      <rect x="156" y="304" width="388" height="64" rx="10" fill="#1e293b" />
      <rect x="168" y="316" width="60" height="4" rx="2" fill="#e2e8f0" />
      <rect x="168" y="326" width="40" height="3" rx="1.5" fill="#475569" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={208 + i * 80} cy={348} r="10" fill="#0f172a" />
          <rect
            x={200 + i * 80}
            y={344}
            width="16"
            height="3"
            rx="1.5"
            fill="#334155"
          />
          <rect
            x={200 + i * 80}
            y={349}
            width="12"
            height="3"
            rx="1.5"
            fill="#1e293b"
          />
          <rect
            x={224 + i * 80}
            y={344}
            width="45"
            height="3.5"
            rx="1.75"
            fill="#334155"
          />
          <rect
            x={224 + i * 80}
            y={350}
            width="30"
            height="3"
            rx="1.5"
            fill="#1e293b"
          />
        </g>
      ))}
    </svg>
  )
}
