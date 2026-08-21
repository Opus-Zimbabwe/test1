'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink } from 'lucide-react'

export type Project = {
  name: string
  type: string
  description: string
  url?: string
  placeholderColors?: string
  initials?: string
}

function screenshotUrl(url: string) {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
}

export default function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  const [failed, setFailed] = useState(false)
  const hasShot = project.url && !failed

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-surface2 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-shadow duration-500 hover:shadow-[0_24px_50px_rgba(249,115,22,0.15)]"
    >
      <div className="relative h-60 overflow-hidden bg-ink">
        {hasShot ? (
          <img
            src={screenshotUrl(project.url as string) || '/placeholder.svg'}
            alt={`${project.name} website preview`}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: project.placeholderColors || 'linear-gradient(135deg,#0a0a0a,#dc2626)' }}
          >
            <span className="text-6xl font-extrabold tracking-tight text-white/90">{project.initials || 'OZ'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
        <span className="absolute bottom-5 left-6 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">
          {project.url ? 'Live project' : 'In progress'}
        </span>
        {project.url && (
          <span className="absolute bottom-5 right-6 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
            View Site <ArrowUpRight size={14} />
          </span>
        )}
      </div>
      <div className="p-8">
        <p className="text-sm font-semibold uppercase tracking-[.12em] text-primary">{project.type}</p>
        <h2 className="mt-3 text-2xl font-bold text-white">{project.name}</h2>
        <p className="mt-4 leading-7 text-zinc-400">{project.description}</p>
        {project.url ? (
          <a
            className="mt-7 inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-white"
            href={project.url}
            target="_blank"
            rel="noreferrer"
          >
            View Live <ExternalLink size={17} />
          </a>
        ) : (
          <span className="mt-7 inline-flex items-center gap-2 font-semibold text-zinc-500">Coming online soon</span>
        )}
      </div>
    </motion.article>
  )
}
