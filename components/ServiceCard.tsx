'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import ServiceArt from '@/components/ServiceArt'

export default function ServiceCard({
  gradient,
  title,
  icon,
  outcome,
  slug,
  ctaText,
  ctaHref,
  delay = 0,
}: {
  gradient: string
  title: string
  icon: React.ReactNode
  outcome: string
  slug: string
  ctaText: string
  ctaHref: string
  delay?: number
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-[26px] border border-white/10 bg-surface2 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-shadow duration-500 hover:shadow-[0_22px_50px_rgba(249,115,22,0.16)]"
    >
      <div className="relative h-[210px] overflow-hidden" style={{ background: `linear-gradient(${gradient})` }}>
        {/* Subtle themed illustration art layer */}
        <ServiceArt
          slug={slug}
          className="absolute right-2 top-2 h-[150px] w-[150px] text-white opacity-[0.12] transition-opacity duration-500 group-hover:opacity-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />

        {/* Service title */}
        <div className="absolute left-5 right-4 top-5 z-[3] text-sm font-semibold text-white drop-shadow">{title}</div>

        {/* Groove connector: rounded corners at the card edges + smooth bezier S-curve cradling the icon */}
        <svg viewBox="0 0 400 230" preserveAspectRatio="none" className="absolute inset-0 z-[1] h-full w-full text-surface2">
          <path
            d="M0,230 L0,212 Q0,198 14,198 L150,198 C176,198 178,170 200,170 C222,170 224,198 250,198 L386,198 Q400,198 400,212 L400,230 Z"
            fill="currentColor"
          />
          <path
            d="M14,197 L150,197 C176,197 178,169 200,169 C222,169 224,197 250,197 L386,197"
            fill="none"
            stroke="#f97316"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>

        {/* Icon sitting in the groove crest */}
        <div className="pointer-events-none absolute left-1/2 top-[62%] z-[3] -translate-x-1/2">
          <span className="flex size-[50px] items-center justify-center rounded-full border-[3px] border-surface2 bg-brand-gradient text-white shadow-glow transition-transform duration-500 group-hover:scale-110">
            {icon}
          </span>
        </div>
      </div>

      <div className="px-5 pb-6 pt-5">
        <h3 className="text-[1.05rem] font-bold text-white">{title}</h3>
        <p className="mt-2 min-h-10 text-sm leading-6 text-zinc-400">{outcome}</p>
        <Link
          href={ctaHref}
          className="mt-5 inline-flex items-center gap-1 rounded-full bg-brand-gradient px-4 py-2 text-[.82rem] font-semibold text-white transition-transform duration-200 hover:scale-[1.03]"
        >
          {ctaText}
          <ArrowRight size={15} />
        </Link>
      </div>
    </motion.article>
  )
}
