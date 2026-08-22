'use client'
import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

type Props = {
  name: string
  category: string
  url: string | null
  live: boolean
}

// Styled placeholder for projects without a live URL (e.g. Killing Giants)
function KGPlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-900 p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-600 bg-zinc-800">
        <span className="text-2xl font-extrabold text-white">KG</span>
      </div>
      <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-red-500">Killing Giants Dance Crew</p>
      <p className="mt-2 text-xs text-zinc-400">Site coming soon</p>
    </div>
  )
}

export default function ProjectCard({ name, category, url, live }: Props) {
  const [imgError, setImgError] = useState(false)
  const screenshotSrc = url
    ? `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
    : null

  return (
    <div className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Preview image */}
      <div className="relative h-52 w-full overflow-hidden bg-zinc-100">
        {live && screenshotSrc && !imgError ? (
          <>
            <img
              src={screenshotSrc}
              alt={`${name} preview`}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </>
        ) : url ? (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
            <span className="text-lg font-bold text-zinc-400">{name}</span>
          </div>
        ) : (
          <KGPlaceholder />
        )}
      </div>

      {/* Card body */}
      <div className="flex items-center justify-between p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{category}</p>
          <h3 className="mt-1 font-bold text-zinc-900">{name}</h3>
        </div>
        {live && url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="ml-4 flex shrink-0 items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-xs font-semibold text-white shadow-glow transition-transform hover:scale-[1.04]"
          >
            View site <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  )
}
