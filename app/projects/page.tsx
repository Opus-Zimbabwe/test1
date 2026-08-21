import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import ProjectCard, { Project } from '@/components/ProjectCard'
import Reveal from '@/components/Reveal'

const projects: Project[] = [
  {
    name: 'Prime Property Investment & Development Group',
    type: 'Property and investment',
    description:
      'A credible digital presence for a property organisation, built to communicate its portfolio, capability and investment focus.',
    url: 'https://primepidg.co.zw',
  },
  {
    name: 'Great Couples International Trust',
    type: 'Non-profit and family services',
    description:
      'A welcoming public website that makes it easier for couples, families and partners to understand the organisation and find support.',
    url: 'https://greatcouples.org.zw',
  },
  {
    name: 'ForgePoint Technologies',
    type: 'Technology and software',
    description:
      'A sharp technology brand site presenting engineering services and capability with a clean, modern digital identity.',
    url: 'https://forgepointtechnologies.netlify.app',
  },
  {
    name: 'Killing Giants Dance Crew',
    type: 'Arts and culture',
    description:
      'A bold visual identity in progress for a dance crew — high-energy black, red and white styling that matches their stage presence.',
    placeholderColors: 'linear-gradient(135deg,#0a0a0a 0%,#0a0a0a 50%,#dc2626 100%)',
    initials: 'KG',
  },
]

export default function Projects() {
  return (
    <main className="bg-ink py-16 md:py-24">
      <section className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[.14em] text-primary">Selected work</p>
          <h1 className="mt-3 text-balance text-4xl font-bold leading-tight text-white md:text-6xl">
            Useful digital experiences for organisations doing important work.
          </h1>
          <p className="mt-6 text-lg leading-7 text-zinc-400">
            Our work is designed around the people who need to use it: customers, communities, staff and decision-makers.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} delay={(i % 2) * 0.08} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-surface2 via-surface to-ink p-8 md:p-10">
            <div className="orb h-48 w-48 bg-primary/25" style={{ right: '10%', top: '-30%' }} />
            <p className="relative text-sm font-semibold uppercase tracking-[.14em] text-primary">Your project</p>
            <div className="relative mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-2xl text-3xl font-bold text-white">The next case study could be your organisation.</h2>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 font-semibold text-white shadow-glow transition-transform duration-200 hover:scale-[1.03]"
              >
                Start a conversation <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
