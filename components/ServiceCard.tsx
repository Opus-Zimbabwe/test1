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
      className="group overflow-hidden rounded-[26px] border border-zinc-200 bg-white shadow-card transition-shadow duration-500 hover:shadow-card-hover"
    >
      {/* Coloured upper header with SVG art */}
      <div className="relative h-[210px] overflow-hidden" style={{ background: `linear-gradient(${gradient})` }}>
        {/* Themed SVG illustration — very subtle background layer */}
        <ServiceArt
          slug={slug}
          className="absolute right-2 top-2 h-[150px] w-[150px] text-white opacity-[0.12] transition-opacity duration-500 group-hover:opacity-[0.22]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/35" />

        {/* Service title in header */}
        <div className="absolute left-5 right-4 top-5 z-[3] text-sm font-semibold text-white drop-shadow">{title}</div>

        {/* Groove — white fill so it blends into the white card body below */}
        <svg viewBox="0 0 400 230" preserveAspectRatio="none" className="absolute inset-0 z-[1] h-full w-full text-white">
          <path
            d="M0,230 L0,212 Q0,198 14,198 L150,198 C176,198 178,170 200,170 C222,170 224,198 250,198 L386,198 Q400,198 400,212 L400,230 Z"
            fill="currentColor"
          />
          {/* Orange groove line */}
          <path
            d="M14,197 L150,197 C176,197 178,169 200,169 C222,169 224,197 250,197 L386,197"
            fill="none"
            stroke="#f97316"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>

        {/* Icon in groove crest */}
        <div className="pointer-events-none absolute left-1/2 top-[62%] z-[3] -translate-x-1/2">
          <span className="flex size-[50px] items-center justify-center rounded-full border-[3px] border-white bg-brand-gradient text-white shadow-glow transition-transform duration-500 group-hover:scale-110">
            {icon}
          </span>
        </div>
      </div>

      {/* White card body */}
      <div className="px-5 pb-6 pt-5">
        <h3 className="text-[1.05rem] font-bold text-zinc-900">{title}</h3>
        <p className="mt-2 min-h-10 text-sm leading-6 text-zinc-500">{outcome}</p>
        <Link
          href={ctaHref}
          className="mt-5 inline-flex items-center gap-1 rounded-full bg-brand-gradient px-4 py-2 text-[.82rem] font-semibold text-white shadow-glow transition-transform duration-200 hover:scale-[1.03]"
        >
          {ctaText}
          <ArrowRight size={15} />
        </Link>
      </div>
    </motion.article>
  )
}
