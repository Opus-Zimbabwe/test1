'use client'

import Link from 'next/link'
import { ArrowRight, Bot, Globe2, Palette, Server, Workflow, Wrench } from 'lucide-react'

const services = [
  { id: 'web-dev', icon: Globe2, label: 'Web development', title: 'Websites that earn trust and enquiries', description: 'Clear, responsive websites for organisations that need to look credible and make it easy for people to act.', items: ['Business and corporate websites', 'E-commerce and landing pages', 'Redesigns, maintenance and support'], href: '/services/web-design', image: '/images/web-design-card.jpg' },
  { id: 'software-systems', icon: Wrench, label: 'Business systems', title: 'Turn repetitive work into a simple system', description: 'Custom tools that bring your people, information and daily operations into one reliable workflow.', items: ['School and business management', 'Inventory, POS, CRM and booking', 'Dashboards and enterprise workflows'], href: '/contact', image: '/images/silver-wave-bg.jpg' },
  { id: 'ai-automation', icon: Bot, label: 'AI and automation', title: 'Give your team more time to do valuable work', description: 'Practical AI assistants and automations that improve customer response, internal knowledge and operations.', items: ['Website and WhatsApp chatbots', 'Customer support automation', 'Document processing and AI assistants'], href: '/contact', image: '/images/orange-abstract-bg.jpg' },
  { id: 'brand-design', icon: Palette, label: 'Brand and graphic design', title: 'Make every first impression consistent', description: 'A focused visual identity and marketing kit that helps your organisation show up with confidence.', items: ['Logos and brand identity', 'Social media and campaign graphics', 'Flyers, brochures, menus and video ads'], href: '/contact', image: '/images/gold-wave-bg.jpg' },
  { id: 'domains-hosting', icon: Server, label: 'Domains and hosting', title: 'A dependable home for your digital presence', description: 'Get the domain, hosting, business email and SSL setup your organisation needs to operate professionally.', items: ['.co.zw, .org.zw, .ac.zw and global domains', 'Managed hosting and SSL', 'Business email setup and support'], href: '/domains', image: '/images/white-ribbon-bg.jpg' },
  { id: 'integrations', icon: Workflow, label: 'Integrations', title: 'Connect the tools you already use', description: 'Remove data silos by connecting payments, CRMs, ERPs and the platforms your team relies on.', items: ['Paynow, EcoCash and Stripe', 'Google and Microsoft APIs', 'CRM, ERP and multi-system integrations'], href: '/contact', image: '/images/hero-bg.jpg' },
]

export default function Services() {
  return (
    <main className="py-16 md:py-24">
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 rounded-[2rem] bg-dark px-7 py-10 text-white md:grid-cols-[1.15fr_.85fr] md:px-14 md:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-primary">Services</p>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold leading-tight md:text-6xl">Digital systems that make your organisation easier to trust and easier to run.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-7 text-white/75">We combine strategy, design and technology to help Zimbabwean organisations communicate clearly, serve customers better and grow with confidence.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-white hover:text-dark">Tell us what you need <ArrowRight size={17} /></Link><Link href="/projects" className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 font-semibold text-white hover:border-white">See our work</Link></div>
          </div>
          <div className="flex flex-col justify-end rounded-2xl border border-white/10 bg-white/5 p-6"><p className="text-sm uppercase tracking-[.14em] text-white/55">A better starting point</p><p className="mt-4 text-2xl font-semibold">Start with the outcome, not a list of features.</p><p className="mt-4 leading-7 text-white/65">Tell us what is difficult today. We will help you choose the right combination of website, system, design or automation.</p></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-20"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[.14em] text-primary">What we do</p><h2 className="mt-3 text-3xl font-bold text-dark md:text-4xl">Choose the challenge you want to solve.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-2">{services.map(({ id, icon: Icon, label, title, description, items, href, image }) => <article id={id} key={id} className="group overflow-hidden rounded-[1.7rem] border border-black/5 bg-muted"><div className="grid md:grid-cols-[.72fr_1.28fr]"><div className="min-h-52 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} /><div className="p-7"><div className="flex items-center gap-3 text-primary"><Icon size={20} /><span className="text-sm font-semibold uppercase tracking-[.12em]">{label}</span></div><h3 className="mt-4 text-2xl font-bold text-dark">{title}</h3><p className="mt-3 leading-6">{description}</p><ul className="mt-5 grid gap-2 text-sm">{items.map(item => <li key={item} className="flex gap-2"><span className="text-primary">•</span>{item}</li>)}</ul><Link href={href} className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:text-dark">Explore this service <ArrowRight size={16} /></Link></div></div></article>)}</div></section>
      <section className="mx-auto max-w-7xl px-6 pb-10"><div className="flex flex-col gap-5 rounded-[1.7rem] bg-primary p-8 text-white md:flex-row md:items-center md:justify-between md:p-10"><div><h2 className="text-2xl font-bold md:text-3xl">Not sure which service fits?</h2><p className="mt-2 max-w-xl leading-6 text-white/80">Book a practical discovery conversation and leave with a clear next step.</p></div><Link href="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-dark px-6 py-3 font-semibold text-white hover:bg-white hover:text-dark">Book a discovery call <ArrowRight size={17} /></Link></div></section>
    </main>
  )
}
