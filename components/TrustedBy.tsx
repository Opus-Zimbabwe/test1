'use client'

// Logos are rendered as favicon images. Admin will manage these later.
const logos: { alt: string; src?: string; fallback: string; fallbackClass: string }[] = [
  { alt: 'PPIDG', src: 'https://primepidg.co.zw/favicon-96x96.png', fallback: 'PP', fallbackClass: 'bg-white text-ink' },
  { alt: 'Great Couples', src: 'https://greatcouples.org.zw/favicon-96x96.png', fallback: 'GC', fallbackClass: 'bg-white text-ink' },
  { alt: 'ForgePoint', src: 'https://forgepointtechnologies.netlify.app/favicon.ico', fallback: 'FP', fallbackClass: 'bg-white text-ink' },
  { alt: 'Killing Giants Dance Crew', fallback: 'KG', fallbackClass: 'bg-accent text-white' },
  { alt: 'Opus Zimbabwe', fallback: 'O', fallbackClass: 'bg-ink text-primary ring-1 ring-primary/50' },
]

function Logo({ item }: { item: (typeof logos)[number] }) {
  const box =
    'flex h-14 w-14 items-center justify-center rounded-xl text-lg font-extrabold shadow-[0_6px_18px_rgba(0,0,0,0.35)]'
  if (!item.src) {
    return (
      <div className={`${box} ${item.fallbackClass}`} title={item.alt} aria-label={item.alt}>
        {item.fallback}
      </div>
    )
  }
  return (
    <img
      src={item.src || '/placeholder.svg'}
      alt={item.alt}
      width={40}
      height={40}
      loading="lazy"
      style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.95)', padding: 4 }}
      className="shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
      onError={(e) => {
        const el = e.currentTarget
        const span = document.createElement('div')
        span.className = `${box} ${item.fallbackClass}`
        span.title = item.alt
        span.textContent = item.fallback
        el.replaceWith(span)
      }}
    />
  )
}

export default function TrustedBy() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 opacity-90">
      {logos.map((item) => (
        <Logo key={item.alt} item={item} />
      ))}
    </div>
  )
}
