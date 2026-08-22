'use client'
import { motion } from 'framer-motion'

const particles = [
  { x: '12%', y: '22%', d: 0   },
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
      <div className="orb h-72 w-72 bg-primary/40" style={{ left: '-10px', top: '40px' }} />
      <div className="orb h-80 w-80 bg-accent/30"  style={{ right: 0, top: '33%', animationDelay: '3s' }} />
      <div className="orb h-64 w-64 bg-primary/25" style={{ left: '33%', bottom: 0, animationDelay: '6s' }} />
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-primary/70"
          style={{ left: p.x, top: p.y }}
          animate={{ y: [0, -16, 0], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 5 + p.d, repeat: Infinity, ease: 'easeInOut', delay: p.d }}
        />
      ))}
      {/* Subtle vignette — works on dark hero bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/30 via-transparent to-zinc-900/70" />
    </div>
  )
}
