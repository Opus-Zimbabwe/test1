import Link from 'next/link'
import PricingCard from '@/components/PricingCard'
import IntegrationLogos from '@/components/IntegrationLogos'

export type ServicePageData = {
  eyebrow: string
  headline: string
  intro: string
  cta: string
  image: string
  sectionTitle: string
  body: string
  items: string[]
  price: string
  process: string
  who: string
  related?: string[]
  showIntegrations?: boolean
}

export default function ServicePageTemplate({
  data,
  pricing,
}: {
  data: ServicePageData
  pricing?: { name: string; price: string; features: string[] }[]
}) {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-zinc-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-[.8rem] font-semibold uppercase tracking-[.12em] text-primary">{data.eyebrow}</p>
              <h1 className="mt-4 text-4xl font-extrabold text-zinc-900 md:text-5xl">{data.headline}</h1>
              <p className="mt-5 text-lg leading-7 text-zinc-600">{data.intro}</p>
              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
              >
                {data.cta}
              </Link>
            </div>
            <div
              aria-label={`${data.eyebrow} visual`}
              className="min-h-[260px] bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${data.image})` }}
            />
          </div>
        </div>
      </section>

      {/* Detail */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1.1fr_.9fr]">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">{data.sectionTitle}</h2>
            <p className="mt-5 leading-7 text-zinc-600">{data.body}</p>
            <h3 className="mt-10 font-bold text-zinc-900">What we provide</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.items.map((x) => (
                <div key={x} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-card">
                  {x}
                </div>
              ))}
            </div>
            {data.showIntegrations && <IntegrationLogos />}
          </div>

          <aside className="rounded-[26px] border border-zinc-200 bg-zinc-50 p-7 h-fit shadow-card">
            <p className="text-sm font-semibold text-primary">Starting point</p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{data.price}</p>
            <p className="mt-5 text-sm text-zinc-600"><b className="text-zinc-800">Who it is for:</b> {data.who}</p>
            <p className="mt-5 text-sm text-zinc-600"><b className="text-zinc-800">How it works:</b> {data.process}</p>
            <Link
              href="/contact"
              className="mt-7 inline-flex rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
            >
              Get in touch
            </Link>
          </aside>
        </div>
      </section>

      {/* Pricing */}
      {pricing && (
        <section className="bg-zinc-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl font-bold text-zinc-900">Website Packages</h2>
            <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pricing.map((p) => (
                <PricingCard key={p.name} name={p.name} price={p.price} features={p.features} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why / Related */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Why Opus Zimbabwe?</h2>
            <div className="mt-5 grid gap-3">
              {['Practical solutions built for your context', 'Clear communication throughout', 'Local support, real people', 'Delivered around your goals and timeline'].map((x) => (
                <div key={x} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-card">
                  {x}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Related services</h2>
            <div className="mt-5 grid gap-3">
              {[
                ['Website Design & Development', '/services/web-design'],
                ['AI Solutions & Automation',    '/services/ai-automation'],
                ['Domains & Hosting',            '/domains'],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="font-semibold text-primary transition-colors hover:text-zinc-900"
                >
                  {label} →
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="mt-20 overflow-hidden rounded-[28px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-3 text-zinc-400">Tell us what you need and we will help you choose the right starting point.</p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link href="/contact" className="rounded-full bg-brand-gradient px-6 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]">
              Get Started
            </Link>
            <a href="https://wa.me/263776396530" target="_blank" rel="noreferrer" className="rounded-full border border-white/25 px-6 py-3 font-semibold text-white transition-colors hover:border-primary hover:text-primary">
              Talk to us on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
