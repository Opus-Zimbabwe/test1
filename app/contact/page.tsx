'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, Mail, MessageCircle, Phone, Clock } from 'lucide-react'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-zinc-200">{label}</span>
      {children}
    </label>
  )
}

const infoCards = [
  { icon: Phone, label: 'Call us', value: '0776 396 530', href: 'tel:+263776396530' },
  { icon: MessageCircle, label: 'WhatsApp', value: 'Message our representative', href: 'https://wa.me/263776396530' },
  { icon: Mail, label: 'Email', value: 'info.opuszim@gmail.com', href: 'mailto:info.opuszim@gmail.com' },
  { icon: Clock, label: 'Hours', value: 'Mon–Sat, 8am–6pm CAT', href: undefined },
]

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const input =
    'w-full rounded-xl border border-white/10 bg-surface2 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'pending') return
    setStatus('pending')
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    data.consent = data.consent === 'on' ? 'true' : 'false'
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(response.ok ? 'success' : 'error')
      if (response.ok) form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="bg-ink py-16 md:py-24">
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-surface p-8 text-white md:grid-cols-[.85fr_1.15fr] md:p-14">
          {/* Left: intro + contact info cards */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.14em] text-primary">Start a conversation</p>
            <h1 className="mt-4 text-balance text-4xl font-bold leading-tight md:text-5xl">
              Bring us the problem. We will help shape the next step.
            </h1>
            <p className="mt-6 leading-7 text-zinc-400">
              You do not need a polished brief. Share what you are trying to improve, who it affects and what success would
              look like.
            </p>

            <div className="mt-10 grid gap-3">
              {infoCards.map(({ icon: Icon, label, value, href }) => {
                const inner = (
                  <div className="flex items-center gap-4 rounded-2xl border-l-4 border-primary bg-surface2 p-4 transition-colors hover:bg-surface3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-ink text-primary shadow-glow">
                      <Icon size={19} />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
                      <span className="block font-semibold text-white">{value}</span>
                    </span>
                  </div>
                )
                return href ? (
                  <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {inner}
                  </a>
                ) : (
                  <div key={label}>{inner}</div>
                )
              })}
            </div>
          </div>

          {/* Right: form on a contrasting surface */}
          <form
            className="rounded-[1.5rem] border border-white/10 bg-surface2 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] md:p-8"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Name">
                <input className={input} name="name" required maxLength={100} placeholder="Your full name" />
              </Field>
              <Field label="Email">
                <input className={input} name="email" type="email" required maxLength={254} placeholder="you@example.com" />
              </Field>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Field label="Phone (optional)">
                <input className={input} name="phone" type="tel" maxLength={40} placeholder="+263 ..." />
              </Field>
              <Field label="What can we help with?">
                <select className={input} name="service" required defaultValue="">
                  <option value="" disabled>
                    Select a service
                  </option>
                  <option>Web design</option>
                  <option>Software development</option>
                  <option>AI automation</option>
                  <option>Branding</option>
                  <option>Domains and hosting</option>
                </select>
              </Field>
            </div>
            <div className="mt-5">
              <Field label="Tell us about your goal">
                <textarea
                  className={input}
                  name="message"
                  rows={6}
                  required
                  minLength={10}
                  maxLength={4000}
                  placeholder="What are you trying to improve? Who is it for?"
                />
              </Field>
            </div>
            <label className="mt-5 flex items-start gap-3 text-sm text-zinc-300">
              <input className="mt-1 accent-primary" name="consent" type="checkbox" required />
              <span>I agree to be contacted about this enquiry.</span>
            </label>
            {status === 'success' && (
              <p role="status" className="mt-4 text-sm text-success">
                Thanks — your enquiry has been received.
              </p>
            )}
            {status === 'error' && (
              <p role="alert" className="mt-4 text-sm text-accent">
                Please check your details and try again.
              </p>
            )}
            <button
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 font-semibold text-white shadow-glow transition-transform duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={status === 'pending'}
            >
              {status === 'pending' ? 'Sending…' : 'Send project details'}
              {status !== 'pending' && <ArrowRight size={17} />}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
