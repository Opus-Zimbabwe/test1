import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Twitter, MessageCircle } from 'lucide-react'

const services = [
  ['Website Design & Development', '/services/web-design'],
  ['Software & Systems', '/services/software-development'],
  ['AI & Automation', '/services/ai-automation'],
  ['Graphic Design & Branding', '/services/graphic-design'],
  ['Domain & Hosting', '/services/domains-hosting'],
  ['API & Integrations', '/services/api-integrations'],
]

const company = [
  ['Projects', '/projects'],
  ['Domains & Hosting', '/domains'],
  ['FAQ', '/faq'],
  ['Contact', '/contact'],
]

const socials = [
  ['LinkedIn', 'https://www.linkedin.com/in/opuszimbabwe', Linkedin],
  ['X', 'https://x.com/OpusZimbabwe', Twitter],
  ['WhatsApp', 'https://wa.me/263773979162', MessageCircle],
] as const

export default function Footer() {
  return (
    <footer id="footer" className="relative">
      {/* Blend: gradient fade from content into the footer so there is no hard cut */}
      <div className="h-24 bg-gradient-to-b from-transparent to-[#0d0d0d]" aria-hidden="true" />
      <div className="border-t border-primary/60 bg-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div>
              <Link href="/" className="flex items-center gap-3">
                <Image src="/images/logo.png" alt="Opus Zimbabwe" width={40} height={40} className="h-10 w-10 rounded-full ring-1 ring-primary/40" />
                <span className="text-lg font-bold text-white">Opus Zimbabwe</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">
                Practical digital systems, services and infrastructure built for businesses and organisations in Zimbabwe.
              </p>
              <div className="mt-5 flex gap-3">
                {socials.map(([label, href, Icon]) => (
                  <a
                    key={label}
                    aria-label={label}
                    title={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition-colors hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[.12em] text-primary">Services</h3>
              <div className="mt-4 grid gap-2.5">
                {services.map(([label, href]) => (
                  <Link key={href} href={href} className="text-sm text-zinc-400 transition-colors hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[.12em] text-primary">Company</h3>
              <div className="mt-4 grid gap-2.5">
                {company.map(([label, href]) => (
                  <Link key={href} href={href} className="text-sm text-zinc-400 transition-colors hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[.12em] text-primary">Contact</h3>
              <div className="mt-4 grid gap-2.5 text-sm">
                <a href="https://wa.me/263776396530" target="_blank" rel="noreferrer" className="text-zinc-400 transition-colors hover:text-white">
                  WhatsApp: 0776 396 530
                </a>
                <a href="mailto:info.opuszim@gmail.com" className="text-zinc-400 transition-colors hover:text-white">
                  info.opuszim@gmail.com
                </a>
                <a href="tel:+263776396530" className="text-zinc-400 transition-colors hover:text-white">
                  0776 396 530
                </a>
                <span className="text-zinc-500">Harare, Zimbabwe</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-zinc-500 md:flex-row">
            <p>© {new Date().getFullYear()} Opus Zimbabwe. All rights reserved.</p>
            <p>
              Built by <span className="font-semibold text-primary">Opus Zimbabwe</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
