'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'

export default function DomainSearchBar({ dark = false }: { dark?: boolean }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      window.location.href = `/domains?search=${encodeURIComponent(query.trim())}`
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center overflow-hidden rounded-full border shadow-sm ${
        dark
          ? 'border-white/15 bg-white/10 backdrop-blur-sm'
          : 'border-zinc-200 bg-white'
      }`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a domain, e.g. yourbusiness.co.zw"
        className={`flex-1 bg-transparent px-5 py-3.5 text-sm outline-none ${
          dark ? 'text-white placeholder:text-white/40' : 'text-zinc-800 placeholder:text-zinc-400'
        }`}
      />
      <button
        type="submit"
        className="m-1 flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
      >
        <Search size={15} /> Search
      </button>
    </form>
  )
}
