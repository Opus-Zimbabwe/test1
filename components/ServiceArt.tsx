/* Subtle inline SVG background art layered inside each service card.
   Themed per service; rendered at low opacity behind the label + icon. */
type Props = { slug: string; className?: string }

const stroke = 'currentColor'

export default function ServiceArt({ slug, className }: Props) {
  const common = {
    viewBox: '0 0 200 200',
    fill: 'none',
    className,
    'aria-hidden': true as const,
    preserveAspectRatio: 'xMidYMid meet',
  }

  switch (slug) {
    case 'web-design':
      // layered browser / device wireframe
      return (
        <svg {...common}>
          <rect x="30" y="46" width="120" height="86" rx="8" stroke={stroke} strokeWidth="2" />
          <line x1="30" y1="62" x2="150" y2="62" stroke={stroke} strokeWidth="2" />
          <circle cx="40" cy="54" r="2.4" fill={stroke} />
          <circle cx="49" cy="54" r="2.4" fill={stroke} />
          <circle cx="58" cy="54" r="2.4" fill={stroke} />
          <rect x="42" y="74" width="40" height="8" rx="3" stroke={stroke} strokeWidth="2" />
          <rect x="42" y="90" width="70" height="6" rx="3" stroke={stroke} strokeWidth="2" />
          <rect x="42" y="102" width="54" height="6" rx="3" stroke={stroke} strokeWidth="2" />
          <rect x="70" y="96" width="96" height="70" rx="8" stroke={stroke} strokeWidth="2" />
          <rect x="118" y="120" width="30" height="52" rx="6" stroke={stroke} strokeWidth="2" />
        </svg>
      )
    case 'software-development':
      // circuit board / interconnected nodes
      return (
        <svg {...common}>
          <rect x="86" y="86" width="28" height="28" rx="4" stroke={stroke} strokeWidth="2" />
          <path d="M100 86V54M100 114v32M86 100H54M114 100h32" stroke={stroke} strokeWidth="2" />
          <path d="M92 86V66M108 114v20" stroke={stroke} strokeWidth="2" />
          {[
            [100, 46],
            [100, 154],
            [46, 100],
            [154, 100],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="6" stroke={stroke} strokeWidth="2" />
          ))}
          <path d="M54 100 40 100M40 76h20M40 124h20" stroke={stroke} strokeWidth="2" />
          <circle cx="40" cy="76" r="4" stroke={stroke} strokeWidth="2" />
          <circle cx="40" cy="124" r="4" stroke={stroke} strokeWidth="2" />
        </svg>
      )
    case 'ai-automation':
      // neural net nodes + connections
      return (
        <svg {...common}>
          {[50, 100, 150].map((y) => (
            <circle key={`a${y}`} cx="50" cy={y} r="7" stroke={stroke} strokeWidth="2" />
          ))}
          {[75, 125].map((y) => (
            <circle key={`b${y}`} cx="100" cy={y} r="7" stroke={stroke} strokeWidth="2" />
          ))}
          <circle cx="150" cy="100" r="7" stroke={stroke} strokeWidth="2" />
          <path
            d="M57 50 93 75M57 100 93 75M57 100 93 125M57 150 93 125M107 75 143 100M107 125 143 100"
            stroke={stroke}
            strokeWidth="1.6"
          />
        </svg>
      )
    case 'domains-hosting':
      // isometric server rack / cloud
      return (
        <svg {...common}>
          <path d="M60 74a20 16 0 1 1 40 0h6a16 12 0 1 1 0 24H62a18 14 0 1 1-2-24Z" stroke={stroke} strokeWidth="2" />
          {[112, 132, 152].map((y) => (
            <g key={y}>
              <rect x="66" y={y} width="68" height="14" rx="3" stroke={stroke} strokeWidth="2" />
              <circle cx="76" cy={y + 7} r="2.4" fill={stroke} />
              <circle cx="86" cy={y + 7} r="2.4" fill={stroke} />
              <line x1="112" y1={y + 7} x2="126" y2={y + 7} stroke={stroke} strokeWidth="2" />
            </g>
          ))}
        </svg>
      )
    case 'api-integrations':
      // puzzle pieces connecting
      return (
        <svg {...common}>
          <path
            d="M60 60h26a8 8 0 0 1 16 0h12v26a8 8 0 0 1 0 16v12H88a8 8 0 0 0 0-16H60V88a8 8 0 0 0 0-16V60Z"
            stroke={stroke}
            strokeWidth="2"
          />
          <path
            d="M118 92h22v22a8 8 0 0 1 0 16v10h-30a8 8 0 0 0 0-16h-2"
            stroke={stroke}
            strokeWidth="2"
          />
        </svg>
      )
    case 'graphic-design':
      // shield / creative mark fallback (branding)
      return (
        <svg {...common}>
          <path d="M100 44l44 16v34c0 30-20 50-44 62-24-12-44-32-44-62V60l44-16Z" stroke={stroke} strokeWidth="2" />
          <circle cx="100" cy="96" r="16" stroke={stroke} strokeWidth="2" />
          <path d="M100 80v32M84 96h32" stroke={stroke} strokeWidth="2" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="100" cy="100" r="50" stroke={stroke} strokeWidth="2" />
        </svg>
      )
  }
}
