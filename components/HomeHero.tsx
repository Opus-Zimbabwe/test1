'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import DomainSearchBar from '@/components/DomainSearchBar'
import HeroBackground from '@/components/HeroBackground'

const services = [
  ['Website Design & Development', '/services/web-design'],
  ['Software & System Development', '/services/software-development'],
  ['AI Solutions & Automation', '/services/ai-automation'],
  ['Graphic Design & Branding', '/services/graphic-design'],
  ['Domain Registration & Web Hosting', '/services/domains-hosting'],
  ['API & System Integrations', '/services/api-integrations'],
]

export default function HomeHero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % services.length), 3500)
    return () => clearInterval(t)
  }, [])
  const [name, href] = services[i]

  const fade = {
    hidden: { opacity: 0, y: 26 },
    show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: d } }),
  }

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-ink">
      <HeroBackground />
      <div className="relative mx-auto w-full max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <motion.p
            variants={fade}
            custom={0}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[.8rem] font-semibold uppercase tracking-[.12em] text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Opus Zimbabwe digital services
          </motion.p>

          <motion.h1
            variants={fade}
            custom={0.1}
            initial="hidden"
            animate="show"
            className="mt-6 text-balance text-[clamp(2.2rem,4.5vw+1rem,3.75rem)] font-extrabold leading-[1.05] text-white"
          >
            Digital systems built for{' '}
            <span className="bg-brand-gradient bg-clip-text text-transparent">Zimbabwean businesses.</span>
          </motion.h1>

          <motion.p
            variants={fade}
            custom={0.2}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-xl text-lg leading-7 text-zinc-400"
          >
            Websites, software, AI automation, branding and hosting — practical infrastructure for the way your organisation
            actually works. Currently featuring{' '}
            <Link href={href} className="font-semibold text-primary transition-colors hover:text-white">
              {name}
            </Link>
            .
          </motion.p>

          <motion.div variants={fade} custom={0.3} initial="hidden" animate="show" className="mt-8 max-w-xl">
            <DomainSearchBar />
          </motion.div>

          <motion.div variants={fade} custom={0.4} initial="hidden" animate="show" className="mt-7 flex flex-wrap gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 font-semibold text-white shadow-glow transition-transform duration-200 hover:scale-[1.03]"
            >
              Explore services <ArrowRight size={17} />
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:border-primary hover:text-primary"
            >
              Start a project
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
