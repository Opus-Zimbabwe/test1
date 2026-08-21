import Link from 'next/link'
import { Globe, LayoutDashboard, Bot, Palette, Server, Plug, ArrowRight } from 'lucide-react'
import ServiceCard from '@/components/ServiceCard'
import HomeHero from '@/components/HomeHero'
import FaqAccordion from '@/components/FaqAccordion'
import WhyChoose from '@/components/WhyChoose'
import TrustedBy from '@/components/TrustedBy'
import Reveal from '@/components/Reveal'
import CountUp from '@/components/CountUp'

const services: {
  title: string
  gradient: string
  icon: React.ReactNode
  slug: string
  outcome: string
}[] = [
  { title: 'Website Design & Development', gradient: '160deg,#1a1a1a,#f97316', icon: <Globe size={22} />, slug: 'web-design', outcome: 'Launch faster with a site that turns visitors into enquiries.' },
  { title: 'Software & Systems', gradient: '160deg,#1a1a1a,#dc2626', icon: <LayoutDashboard size={22} />, slug: 'software-development', outcome: 'Replace messy spreadsheets with one system your whole team trusts.' },
  { title: 'AI Solutions & Automation', gradient: '160deg,#1a1a1a,#f97316', icon: <Bot size={22} />, slug: 'ai-automation', outcome: 'Automate your ops and free your team for work that matters.' },
  { title: 'Graphic Design & Branding', gradient: '160deg,#dc2626,#f97316', icon: <Palette size={22} />, slug: 'graphic-design', outcome: 'Look as professional as the service you actually deliver.' },
  { title: 'Domain & Hosting', gradient: '160deg,#1a1a1a,#f97316', icon: <Server size={22} />, slug: 'domains-hosting', outcome: 'Get online with a fast, secure home for your brand.' },
  { title: 'API & Integrations', gradient: '160deg,#1a1a1a,#dc2626', icon: <Plug size={22} />, slug: 'api-integrations', outcome: 'Connect the tools you already use so data moves itself.' },
]

const stats: { value: number; suffix?: string; prefix?: string; label: string }[] = [
  { value: 40, suffix: '+', label: 'Projects delivered' },
  { value: 6, label: 'Core service lines' },
  { value: 5, suffix: 'x', label: 'Local payment methods' },
  { value: 100, suffix: '%', label: 'Built in Zimbabwe' },
]

const faqs = [
  { q: 'How do I pay for a project?', a: 'You can use EcoCash, OneMoney, InnBucks, Zimswitch and other supported Zimbabwean payment methods.' },
  { q: 'How long does a project take?', a: 'Timing depends on the scope. We confirm a clear delivery plan once we understand your requirements.' },
  { q: 'Do you provide domains, hosting and business email?', a: 'Yes. Domain registration, hosting and professional business email are all available through Opus Zimbabwe.' },
]

export default function Home() {
  return (
    <main className="bg-ink">
      <HomeHero />

      {/* Trusted by */}
      <section className="section-fade-top py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Reveal>
            <p className="text-[.8rem] font-semibold uppercase tracking-[.12em] text-primary">Partners who trust us</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Trusted by organisations building what matters.</h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <TrustedBy />
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <p className="text-[.8rem] font-semibold uppercase tracking-[.12em] text-primary">What we build</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Six disciplines, one team.</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard
              key={s.slug}
              title={s.title}
              gradient={s.gradient}
              icon={s.icon}
              slug={s.slug}
              outcome={s.outcome}
              ctaText="Learn more"
              ctaHref={`/services/${s.slug}`}
              delay={(i % 3) * 0.08}
            />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-surface2 p-8 md:grid-cols-4 md:p-12">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <div className="bg-brand-gradient bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
                <CountUp to={s.value} suffix={s.suffix} prefix={s.prefix} />
              </div>
              <p className="mt-2 text-sm text-zinc-400">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section id="why" className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <p className="text-[.8rem] font-semibold uppercase tracking-[.12em] text-primary">Why choose Opus Zimbabwe</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Outcomes you can actually feel.</h2>
        </Reveal>
        <div className="mt-10">
          <WhyChoose />
        </div>
      </section>

      {/* Featured work */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <p className="text-[.8rem] font-semibold uppercase tracking-[.12em] text-primary">Our projects</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Work that is already out in the world.</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            ['Great Couples International Trust', 'https://greatcouples.org.zw'],
            ['Prime Property Investment & Development Group', 'https://primepidg.co.zw'],
          ].map(([name, url], i) => (
            <Reveal key={url} delay={i * 0.08}>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-3xl border border-white/10 bg-surface2 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <h3 className="text-xl font-bold text-white">{name}</h3>
                <ArrowRight className="text-primary transition-transform group-hover:translate-x-1" size={20} />
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.16} className="mt-8">
          <Link href="/projects" className="inline-flex items-center gap-1 font-semibold text-primary hover:text-white">
            See all projects <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <p className="text-[.8rem] font-semibold uppercase tracking-[.12em] text-primary">FAQ</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Common questions.</h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-7">
          <FaqAccordion items={faqs} />
        </Reveal>
        <Reveal delay={0.16}>
          <Link href="/faq" className="mt-6 inline-flex items-center gap-1 font-semibold text-primary hover:text-white">
            See all questions <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-surface2 via-surface to-ink p-10 text-center md:p-16">
          <div className="orb h-56 w-56 bg-primary/30" style={{ left: '10%', top: '-20%' }} />
          <div className="orb h-56 w-56 bg-accent/25" style={{ right: '8%', bottom: '-30%' }} />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to build something useful?</h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Tell us what is difficult today and we will help you choose the right starting point.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-7 py-3.5 font-semibold text-white shadow-glow transition-transform duration-200 hover:scale-[1.03]"
            >
              Contact us <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
