'use client'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Dir = 'up' | 'down' | 'left' | 'right' | 'none'

const offset: Record<Dir, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
  none: {},
}

export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  direction?: Dir
  className?: string
  as?: 'div' | 'section' | 'article' | 'li' | 'span'
}) {
  const MotionTag = motion[as] as typeof motion.div
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </MotionTag>
  )
}
