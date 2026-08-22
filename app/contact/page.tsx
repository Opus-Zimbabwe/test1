'use client'
import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react'
import Reveal from '@/components/Reveal'

const info = [
  { icon: Phone,   label: 'WhatsApp / Phone', value: '0776 396 530',           href: 'https://wa.me/263776396530' },
  { icon: Mail,    label: 'Email',             value: 'info.opuszim@gmail.com', href: 'mailto:info.opuszim@gmail.com' },
  { icon: MapPin,  label: 'Location',          value: 'Harare, Zimbabwe',       href: undefined },
  { icon: Clock,   label: 'Business Hours',    value: 'Mon–Fri, 8am–5pm',      href: undefined },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const field = (id: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-zinc-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
      />
    </div>
  )

  return (
    <main className="bg-white">
      {/* Header */}
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-[.8rem] font-semibold uppercase tracking-[.12em] text-primary">Get in touch</p>
            <h1 className="mt-2 text-4xl font-extrabold text-zinc-900 md:text-5xl">Let&apos;s talk about your project.</h1>
            <p className="mt-4 max-w-xl text-lg text-zinc-500">
              Tell us what you need. We&apos;ll get back to you within one business day.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">

          {/* Form */}
          <Reveal>
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-card">
              {status === 'sent' ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                    <ArrowRight className="text-green-500" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">Message sent!</h3>
                  <p className="mt-2 text-zinc-500">We&apos;ll get back to you within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {field('name', 'Full name', 'text', 'Your full name')}
                    {field('email', 'Email address', 'email', 'you@example.com')}
                  </div>
                  {field('phone', 'Phone / WhatsApp', 'tel', '+263 77 …')}
                  <div>
                    <label htmlFor="service" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                      Service you&apos;re interested in
                    </label>
                    <select
                      id="service"
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                    >
                      <option value="">Select a service…</option>
                      <option>Website Design &amp; Development</option>
                      <option>Software &amp; Systems</option>
                      <option>AI Solutions &amp; Automation</option>
                      <option>Graphic Design &amp; Branding</option>
                      <option>Domain &amp; Hosting</option>
                      <option>API &amp; Integrations</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                      Your message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your project or question…"
                      className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                  </div>
                  {status === 'error' && (
                    <p className="text-sm text-red-500">Something went wrong. Please try again or WhatsApp us directly.</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="rounded-full bg-brand-gradient px-7 py-3.5 font-semibold text-white shadow-glow transition-transform duration-200 hover:scale-[1.03] disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Contact info cards */}
          <Reveal delay={0.1}>
            <div className="grid gap-4">
              {info.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-card border-l-4 border-l-primary"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
                    {href ? (
                      <a href={href} className="mt-0.5 font-semibold text-zinc-800 hover:text-primary transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-0.5 font-semibold text-zinc-800">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/263776396530"
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-brand-gradient px-6 py-4 font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
