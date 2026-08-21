'use client'
import { motion } from 'framer-motion'

const logos: { name: string; src: string }[] = [
  { name: 'Stripe', src: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' },
  { name: 'Google', src: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png' },
  { name: 'Microsoft', src: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
  { name: 'WhatsApp', src: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg' },
  { name: 'PayPal', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
  { name: 'GitHub', src: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' },
  { name: 'Slack', src: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' },
]

export default function IntegrationLogos() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {logos.map((logo, i) => (
        <motion.div
          key={logo.name}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.06 }}
          whileHover={{ y: -4 }}
          className="group flex h-28 items-center justify-center rounded-2xl border border-white/10 bg-surface2 p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(249,115,22,0.15)]"
        >
          <img
            src={logo.src || '/placeholder.svg'}
            alt={`${logo.name} logo`}
            loading="lazy"
            className="max-h-9 w-auto max-w-[70%] object-contain opacity-80 transition-opacity duration-300 [filter:brightness(0)_invert(1)] group-hover:opacity-100"
            onError={(e) => {
              const el = e.currentTarget
              const span = document.createElement('span')
              span.className = 'font-bold text-white'
              span.textContent = logo.name
              el.replaceWith(span)
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
