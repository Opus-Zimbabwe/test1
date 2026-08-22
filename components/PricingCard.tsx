import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function PricingCard({
  name,
  price,
  features,
}: {
  name: string
  price: string
  features: string[]
}) {
  const isPro    = name === 'Professional'
  const isCustom = name === 'Custom'

  return (
    <article
      className={`flex min-h-[390px] flex-col overflow-hidden rounded-[20px] border shadow-card transition-shadow hover:shadow-card-hover ${
        isPro ? 'border-primary/40 bg-white' : 'border-zinc-200 bg-white'
      }`}
    >
      {/* Card header */}
      <div
        className={`rounded-t-[18px] p-6 ${
          isPro
            ? 'bg-brand-gradient'
            : 'bg-zinc-50'
        }`}
      >
        <span
          className={`inline-block rounded-full px-3 py-1 text-[.65rem] font-semibold uppercase tracking-[.08em] ${
            isPro ? 'bg-white/20 text-white' : 'bg-white border border-zinc-200 text-zinc-700'
          }`}
        >
          {name}
        </span>
        <h3 className={`mt-6 text-[2rem] font-extrabold leading-none ${isPro ? 'text-white' : 'text-zinc-900'}`}>
          {price}
          {!isCustom && (
            <span className={`text-sm font-medium ${isPro ? 'text-white/70' : 'text-zinc-500'}`}>/project</span>
          )}
        </h3>
        <p className={`mt-2 text-sm ${isPro ? 'text-white/80' : 'text-zinc-500'}`}>
          {isPro ? 'Perfect for growing organisations' : isCustom ? 'For large organisations' : 'Perfect for small organisations'}
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1 space-y-3">
          {features.map((f) => (
            <div key={f} className="flex items-start gap-2 text-sm text-zinc-600">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
              {f}
            </div>
          ))}
        </div>
        <Link
          href="/contact"
          className={`mt-6 w-full rounded-full py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] ${
            isPro
              ? 'bg-brand-gradient text-white shadow-glow'
              : 'border border-zinc-200 bg-white text-zinc-800 hover:border-primary hover:text-primary'
          }`}
        >
          {isCustom ? 'Contact Us' : 'Start a Project'}
        </Link>
      </div>
    </article>
  )
}
