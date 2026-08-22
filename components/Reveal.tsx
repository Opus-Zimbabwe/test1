'use client'
import { motion } from 'framer-motion'

export default function Reveal({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const offsets: Record<string, { x: number; y: number }> = {
    up:    { x: 0,   y: 24 },
    down:  { x: 0,   y: -24 },
    left:  { x: 24,  y: 0 },
    right: { x: -24, y: 0 },
  }
  const { x, y } = offsets[direction]

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
