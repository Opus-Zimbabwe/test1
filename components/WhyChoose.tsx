'use client'
import { motion } from 'framer-motion'
import { Zap, Shield, Headphones, TrendingUp, Wallet, BadgeCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Reason = { icon: LucideIcon; title: string; body: string; ring: 'orange' | 'red' }

const reasons: Reason[] = [
  { icon: Zap,        title: 'Delivered in days, not months',   body: 'Focused scoping and reliable delivery get your project live while it still matters.',        ring: 'orange' },
  { icon: Shield,     title: 'Built secure from day one',        body: 'SSL, safe data handling and hardened configuration come standard, not as an add-on.',         ring: 'red'    },
  { icon: Headphones, title: 'Support in your timezone',         body: 'Reach a real person on WhatsApp, phone or email — no offshore ticket queues.',               ring: 'orange' },
  { icon: TrendingUp, title: 'Designed to convert',             body: 'Every page is built to turn visitors into enquiries, bookings and paying customers.',          ring: 'red'    },
  { icon: Wallet,     title: 'Pay the local way',               body: 'EcoCash, OneMoney, InnBucks, Zimswitch and ZIPIT — priced for Zimbabwean budgets.',            ring: 'orange' },
  { icon: BadgeCheck, title: 'Consistent, dependable quality',  body: 'The same standard of craft, communication and follow-through on every engagement.',            ring: 'red'    },
]

export default function WhyChoose() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {reasons.map(({ icon: Icon, title, body, ring }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
          whileHover={{ y: -4 }}
          className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
        >
          {/* Branded icon with orange/red glow ring */}
          <div
            className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 ${
              ring === 'orange' ? 'shadow-glow' : 'shadow-glow-red'
            }`}
          >
            <span
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-20 ${
                ring === 'orange' ? 'from-primary to-accent' : 'from-accent to-primary'
              }`}
            />
            <Icon className={`relative ${ring === 'orange' ? 'text-primary' : 'text-accent'}`} size={24} />
          </div>
          <h3 className="mt-5 font-bold text-zinc-900">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-500">{body}</p>
        </motion.div>
      ))}
    </div>
  )
}
