'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

type Item = { q: string; a: string }

export default function FaqAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white shadow-card">
      {items.map(({ q, a }, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-zinc-900 transition-colors hover:text-primary"
          >
            {q}
            <ChevronDown
              size={18}
              className={`shrink-0 text-zinc-400 transition-transform duration-300 ${open === i ? 'rotate-180 text-primary' : ''}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-sm leading-6 text-zinc-500">{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
