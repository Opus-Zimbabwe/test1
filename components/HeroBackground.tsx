'use client'
import { motion } from 'framer-motion'

const particles = [
  { x: '12%', y: '22%', d: 0 },
  { x: '28%', y: '68%', d: 0.6 },
  { x: '44%', y: '34%', d: 1.2 },
  { x: '62%', y: '72%', d: 0.3 },
  { x: '76%', y: '28%', d: 0.9 },
  { x: '88%', y: '58%', d: 1.5 },
  { x: '54%', y: '18%', d: 1.8 },
  { x: '20%', y: '46%', d: 2.1 },
]

export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 hero-grid" />
      <div className="orb h-72 w-72 bg-primary/40 -left-10 top-10" />
      <div className="orb h-80 w-80 bg-accent/30 right-0 top-1/3" style={{ animationDelay: '3s' }} />
      <div className="orb h-64 w-64 bg-primary/25 left-1/3 bottom-0" style={{ animationDelay: '6s' }} />
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-primary/70"
          style={{ left: p.x, top: p.y }}
          animate={{ y: [0, -16, 0], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 5 + p.d, repeat: Infinity, ease: 'easeInOut', delay: p.d }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />
    </div>
  )
}
