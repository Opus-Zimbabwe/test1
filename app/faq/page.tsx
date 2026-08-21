import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

const faqs = [
  ['What kind of organisations do you work with?', 'We work with businesses, schools, churches, NGOs, professional practices and growing teams that need a clearer digital presence or a better way to run daily work.'],
  ['How do we choose the right service?', 'Start with the result you want. If people struggle to understand or trust you, begin with a website or brand review. If your team is losing time to repetitive work, explore systems, automation or integrations.'],
  ['What happens after we contact you?', 'We review your goals, audience and current tools, then recommend a practical scope with priorities, deliverables and a clear next step.'],
  ['Can you improve an existing website?', 'Yes. We can audit the content, structure, mobile experience and conversion journey, then improve what is working instead of forcing a full rebuild.'],
  ['Do you provide ongoing support?', 'Yes. Hosting, updates, maintenance, content changes and technical support can be arranged around your organisation’s needs.'],
  ['Do you work outside Zimbabwe?', 'We are based in Zimbabwe and understand the local context, but our websites, systems and integrations can support clients anywhere.'],
]

export default function FAQ() {
  return <main className="py-16 md:py-24"><section className="mx-auto max-w-7xl px-6"><div className="grid gap-10 rounded-[2rem] bg-muted p-8 md:grid-cols-[.9fr_1.1fr] md:p-14"><div><p className="text-sm font-semibold uppercase tracking-[.14em] text-primary">Helpful answers</p><h1 className="mt-3 text-balance text-4xl font-bold leading-tight text-dark md:text-6xl">Before we start, here are the things most teams ask.</h1><p className="mt-6 leading-7">Still unsure? You do not need a perfect brief. Tell us what is not working and we will help you make sense of the options.</p><Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-dark">Ask us directly <ArrowRight size={17} /></Link></div><div className="grid gap-3">{faqs.map(([question, answer]) => <details key={question} className="group rounded-2xl bg-background p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold text-dark"><span>{question}</span><ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" /></summary><p className="mt-4 max-w-xl leading-6">{answer}</p></details>)}</div></div></section></main>
}
