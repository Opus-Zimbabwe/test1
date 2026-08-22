import Link from 'next/link'
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import DomainSearchBar from '@/components/DomainSearchBar'

const domains = [
  ['.co.zw',  '$5/year',  'For Zimbabwean businesses'],
  ['.org.zw', '$6/year',  'For organisations and NGOs'],
  ['.ac.zw',  '$6/year',  'For academic institutions'],
  ['.com',    '$15/year', 'For global businesses'],
  ['.org',    '$15/year', 'For global organisations'],
  ['.net',    '$20/year', 'For networks and technology'],
]

export default function Domains() {
  return (
    <main className="bg-white">
      {/* Hero — keep a rich dark section for the domain search */}
      <section className="bg-zinc-900 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-[1.1fr_.9fr] items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.14em] text-primary">Domains, hosting and email</p>
              <h1 className="mt-4 text-balance text-4xl font-bold leading-tight text-white md:text-5xl">
                Build a digital home people can trust.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-7 text-zinc-300">
                Secure your name, launch your website and give your team professional email without juggling multiple providers.
              </p>
              <div className="mt-8 max-w-xl">
                <DomainSearchBar dark />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <ShieldCheck className="text-primary" size={26} />
              <h2 className="mt-5 text-2xl font-semibold text-white">Managed from one place</h2>
              <p className="mt-3 leading-7 text-zinc-400">
                We can help with registration, DNS, deployment, SSL, backups and the technical details that keep your presence available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Domain options */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[.14em] text-primary">Choose your name</p>
          <h2 className="mt-3 text-3xl font-bold text-zinc-900 md:text-4xl">Zimbabwean and global domain options.</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map(([name, price, audience]) => (
            <article key={name} className="rounded-[1.4rem] border border-zinc-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
              <h3 className="text-3xl font-bold text-zinc-900">{name}</h3>
              <p className="mt-2 text-sm text-zinc-500">{audience}</p>
              <p className="mt-5 text-lg font-semibold text-primary">{price}</p>
              <Link href="/contact" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:text-zinc-900 transition-colors">
                Register this domain <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Hosting & Email */}
      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-[1.6rem] border border-zinc-200 bg-white p-8 shadow-card">
              <h2 className="text-2xl font-bold text-zinc-900">Hosting from $10/month</h2>
              <p className="mt-3 leading-7 text-zinc-600">A practical home for your website with SSL, backups, deployment assistance, security configuration and support options.</p>
              <ul className="mt-6 grid gap-3 text-sm">
                {['Reliable website hosting', 'SSL and deployment support', 'Backups and maintenance options'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-zinc-700">
                    <CheckCircle2 size={17} className="text-primary shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-[1.6rem] border border-zinc-200 bg-white p-8 shadow-card">
              <h2 className="text-2xl font-bold text-zinc-900">Business email from $20/month</h2>
              <p className="mt-3 leading-7 text-zinc-600">Professional addresses such as info@yourcompany.co.zw, with mailbox, webmail and mobile access.</p>
              <ul className="mt-6 grid gap-3 text-sm">
                {['Professional organisation email', 'Mailbox setup and migration help', 'Support for your team'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-zinc-700">
                    <CheckCircle2 size={17} className="text-primary shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-5 rounded-[1.7rem] bg-brand-gradient p-8 text-white shadow-glow md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h2 className="text-2xl font-bold">Need help choosing the right setup?</h2>
            <p className="mt-2 text-white/80">We can recommend a domain, hosting and email setup based on your organisation.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Get a recommendation <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  )
}
