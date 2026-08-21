'use client'

import { FormEvent, useState } from 'react'
import { Mail, MessageCircle, Phone } from 'lucide-react'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-dark">{label}</span>
      {children}
    </label>
  )
}

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const input = 'w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-fg outline-none focus:border-primary'

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
    <main className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-[.8rem] font-semibold uppercase tracking-[.12em] text-primary">Contact</p>
      <h1 className="mt-3 text-4xl font-bold text-dark">Get in touch</h1>
      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-dark">Let&apos;s talk about your project.</h2>
          <div className="mt-6 flex flex-col gap-4 text-sm">
            <a className="flex items-center gap-3 text-primary hover:text-dark" href="https://wa.me/263776396530" target="_blank" rel="noreferrer"><span className="flex size-10 items-center justify-center rounded-full border-2 border-success text-success"><MessageCircle size={20} /></span><span><b className="block text-dark">Chat on WhatsApp</b><small>Message our representative</small></span></a>
            <a className="flex items-center gap-3 text-primary hover:text-dark" href="mailto:info.opuszim@gmail.com"><span className="flex size-10 items-center justify-center rounded-full border border-primary text-primary"><Mail size={19} /></span><span><b className="block text-dark">Email us</b><small>info.opuszim@gmail.com</small></span></a>
            <a className="flex items-center gap-3 text-primary hover:text-dark" href="tel:+263776396530"><span className="flex size-10 items-center justify-center rounded-full border border-primary text-primary"><Phone size={19} /></span><span><b className="block text-dark">Call representative</b><small>0776 396 530</small></span></a>
          </div>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Field label="Name"><input className={input} name="name" required maxLength={100} /></Field>
          <Field label="Email"><input className={input} name="email" type="email" required maxLength={254} /></Field>
          <Field label="Phone (optional)"><input className={input} name="phone" type="tel" maxLength={40} /></Field>
          <Field label="Service"><select className={input} name="service" required defaultValue=""><option value="" disabled>Select a service</option><option>Web design</option><option>Software development</option><option>AI automation</option><option>Branding</option><option>Domains and hosting</option></select></Field>
          <Field label="Message"><textarea className={input} name="message" rows={5} required minLength={10} maxLength={4000} /></Field>
          <label className="flex items-start gap-3 text-sm text-fg"><input className="mt-1" name="consent" type="checkbox" required /><span>I agree to be contacted about this enquiry.</span></label>
          {status === 'success' && <p role="status" className="text-sm text-success">Thanks — your enquiry has been received.</p>}
          {status === 'error' && <p role="alert" className="text-sm text-destructive">Please check your details and try again.</p>}
          <button className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={status === 'pending'}>{status === 'pending' ? 'Sending…' : 'Send enquiry'}</button>
        </form>
      </div>
    </main>
  )
}
