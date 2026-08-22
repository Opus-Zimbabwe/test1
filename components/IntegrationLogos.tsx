'use client'
import { motion } from 'framer-motion'

const logos = [
  { name: 'Stripe',     src: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',          invert: true  },
  { name: 'Google',     src: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',            invert: false },
  { name: 'Microsoft',  src: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',             invert: false },
  { name: 'WhatsApp',   src: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',                              invert: false },
  { name: 'PayPal',     src: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',                                invert: false },
  { name: 'GitHub',     src: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',                  invert: true  },
  { name: 'Slack',      src: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',                       invert: false },
]

export default function IntegrationLogos() {
  return (
    <section className="py-16">
      <p className="mb-8 text-[.8rem] font-semibold uppercase tracking-[.12em] text-primary">Platforms we integrate with</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {logos.map(({ name, src, invert }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover hover:border-primary/40"
          >
            <img
              src={src}
              alt={name}
              className="h-8 w-auto max-w-[80px] object-contain"
              style={invert ? { filter: 'brightness(0)' } : {}}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <span className="text-xs font-semibold text-zinc-500">{name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
