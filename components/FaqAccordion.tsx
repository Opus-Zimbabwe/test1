'use client'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="space-y-3">
      {items.map((x, i) => (
        <div
          key={x.q}
          className={`overflow-hidden rounded-2xl border transition-colors ${
            open === i ? 'border-primary/40 bg-surface2' : 'border-white/10 bg-surface'
          }`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-white"
          >
            {x.q}
            <Plus className={`shrink-0 text-primary transition-transform ${open === i ? 'rotate-45' : ''}`} />
          </button>
          <div
            className={`px-6 text-sm leading-[1.6] text-zinc-400 transition-all duration-300 ${
              open === i ? 'max-h-96 pb-5' : 'max-h-0 overflow-hidden'
            }`}
          >
            {x.a}
          </div>
        </div>
      ))}
    </div>
  )
}
