'use client'
import { Search } from 'lucide-react'
import { useState } from 'react'

export default function DomainSearchBar() {
  const [q, setQ] = useState('')
  const [done, setDone] = useState(false)
  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setDone(true)
        }}
        className="flex items-center gap-1 rounded-full border border-white/10 bg-surface2/90 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-sm focus-within:border-primary/60"
      >
        <Search className="ml-3 text-zinc-500" size={20} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for your domain"
          aria-label="Search for a domain name"
          className="flex-1 bg-transparent px-3 py-2.5 font-medium text-white placeholder:text-zinc-500 outline-none"
        />
        <button className="rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.03]">
          Search
        </button>
      </form>
      {done && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-surface2 p-4 text-sm text-zinc-300">
          <b className="text-white">{q || 'yourdomain'}</b> is available. Contact us to register it.
        </div>
      )}
    </div>
  )
}
