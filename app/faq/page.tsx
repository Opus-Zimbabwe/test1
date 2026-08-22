import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

const faqs = [
  ['What kind of organisations do you work with?', 'We work with businesses, schools, churches, NGOs, professional practices and growing teams that need a clearer digital presence or a better way to run daily work.'],
  ['How do we choose the right service?', 'Start with the result you want. If people struggle to understand or trust you, begin with a website or brand review. If your team is losing time to repetitive work, explore systems, automation or integrations.'],
  ['What happens after we contact you?', 'We review your goals, audience and current tools, then recommend a practical scope with priorities, deliverables and a clear next step.'],
  ['Can you improve an existing website?', 'Yes. We can audit the content, structure, mobile experience and conversion journey, then improve what is working instead of forcing a full rebuild.'],
  ['Do you provide ongoing support?', 'Yes. Hosting, updates, maintenance, content changes and technical support can be arranged around your organisation\'s needs.'],
  ['Do you work outside Zimbabwe?', 'We are based in Zimbabwe and understand the local context, but our websites, systems and integrations can support clients anywhere.'],
]

export default function FAQ() {
  return (
    <main className="bg-white">
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 rounded-[2rem] bg-white border border-zinc-200 shadow-card p-8 md:grid-cols-[.9fr_1.1fr] md:p-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.14em] text-primary">Helpful answers</p>
              <h1 className="mt-3 text-balance text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
                Before we start, here are the things most teams ask.
              </h1>
              <p className="mt-6 leading-7 text-zinc-600">
                Still unsure? You do not need a perfect brief. Tell us what is not working and we will help you make sense of the options.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
              >
                Ask us directly <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid gap-3">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold text-zinc-900">
                    <span>{question}</span>
                    <ChevronDown size={18} className="shrink-0 text-zinc-400 transition-transform group-open:rotate-180 group-open:text-primary" />
                  </summary>
                  <p className="mt-4 max-w-xl leading-6 text-zinc-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
