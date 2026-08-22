'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

const services = [
  ['Website Design & Development', '/services/web-design'],
  ['Software & Systems', '/services/software-development'],
  ['AI & Automation', '/services/ai-automation'],
  ['Graphic Design & Branding', '/services/graphic-design'],
  ['Domain & Hosting', '/services/domains-hosting'],
  ['API & Integrations', '/services/api-integrations'],
]

const links = [
  ['Home', '/'],
  ['Services', '/services'],
  ['Projects', '/projects'],
  ['Domains', '/domains'],
  ['FAQ', '/faq'],
  ['Contact', '/contact'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const pathname = usePathname()
  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className="sticky top-0 z-50 px-4 py-3 md:px-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-zinc-200 bg-white px-2 py-2 shadow-[0_2px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm">
        <Link href="/" aria-label="Opus Zimbabwe home" className="flex items-center pl-1.5">
          <Image src="/images/logo.png" alt="Opus Zimbabwe" width={36} height={36} className="h-9 w-9 rounded-full ring-1 ring-primary/30" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 text-sm md:flex">
          {links.map(([label, href]) =>
            label === 'Services' ? (
              <div key={href} className="group relative">
                <Link
                  href={href}
                  className={`nav-underline inline-flex items-center gap-1 rounded-full px-3.5 py-2 font-medium transition-colors ${
                    active('/services') ? 'text-primary' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Services <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </Link>
                <div className="absolute left-1/2 top-full hidden w-72 -translate-x-1/2 pt-3 group-hover:block">
                  <div className="grid gap-1 rounded-2xl border border-zinc-200 bg-white p-3 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                    {services.map(([l, h]) => (
                      <Link
                        key={h}
                        href={h}
                        className="rounded-xl px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-primary"
                      >
                        {l}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={href}
                href={href}
                className={`nav-underline rounded-full px-3.5 py-2 font-medium transition-colors ${
                  active(href) ? 'text-primary' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden md:flex">
          <Link
            href="/contact"
            className="rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform duration-200 hover:scale-[1.03]"
          >
            Get Started
          </Link>
        </div>

        <button
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="p-1.5 text-zinc-700 md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.1)] md:hidden"
          >
            <nav className="flex flex-col gap-1 text-base font-semibold">
              <Link onClick={() => setOpen(false)} href="/" className="rounded-xl px-3 py-3 text-zinc-800 hover:bg-zinc-50">
                Home
              </Link>
              <div>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-zinc-800 hover:bg-zinc-50"
                >
                  Services
                  <ChevronDown size={18} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-3 grid gap-1 py-1 text-sm font-medium text-zinc-500">
                        {services.map(([label, href]) => (
                          <Link key={href} onClick={() => setOpen(false)} href={href} className="rounded-lg px-3 py-2 hover:text-primary">
                            {label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {[
                ['Projects', '/projects'],
                ['Domains', '/domains'],
                ['FAQ', '/faq'],
                ['Contact', '/contact'],
              ].map(([label, href]) => (
                <Link key={href} onClick={() => setOpen(false)} href={href} className="rounded-xl px-3 py-3 text-zinc-800 hover:bg-zinc-50">
                  {label}
                </Link>
              ))}
              <Link
                onClick={() => setOpen(false)}
                href="/contact"
                className="mt-2 rounded-full bg-brand-gradient px-5 py-3 text-center font-semibold text-white shadow-glow"
              >
                Get Started
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
