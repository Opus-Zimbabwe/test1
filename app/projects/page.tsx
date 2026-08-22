import Reveal from '@/components/Reveal'
import ProjectCard from '@/components/ProjectCard'

const projects = [
  {
    name:     'Prime Property Investment & Development Group',
    category: 'Real Estate Platform',
    url:      'https://primepidg.co.zw',
    live:     true,
  },
  {
    name:     'Great Couples International Trust',
    category: 'Non-Profit / Marriage Counselling',
    url:      'https://greatcouples.org.zw',
    live:     true,
  },
  {
    name:     'ForgePoint Technologies',
    category: 'Tech Company Website',
    url:      'https://forgepointtechnologies.netlify.app',
    live:     true,
  },
  {
    name:     'Killing Giants Dance Crew',
    category: 'Dance Crew / Entertainment',
    url:      null,
    live:     false,
  },
]

export default function ProjectsPage() {
  return (
    <main className="bg-white">
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-[.8rem] font-semibold uppercase tracking-[.12em] text-primary">Our work</p>
            <h1 className="mt-2 text-4xl font-extrabold text-zinc-900 md:text-5xl">Projects already out in the world.</h1>
            <p className="mt-4 max-w-xl text-lg text-zinc-500">
              Real sites, real clients, real results — built and delivered by Opus Zimbabwe.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <ProjectCard {...p} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}
