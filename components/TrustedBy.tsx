'use client'
import { useState } from 'react'

type Client = {
  name: string
  imgSrc?: string
  initials?: string
  color?: string
}

const clients: Client[] = [
  { name: 'PPIDG',              imgSrc: 'https://primepidg.co.zw/favicon-96x96.png'                    },
  { name: 'Great Couples',      imgSrc: 'https://greatcouples.org.zw/favicon-96x96.png'                },
  { name: 'ForgePoint',         imgSrc: 'https://forgepointtechnologies.netlify.app/favicon.ico'       },
  { name: 'Killing Giants',     initials: 'KG', color: '#dc2626'                                       },
  { name: 'Opus Zimbabwe',      initials: 'O',  color: '#f97316'                                       },
]

function LogoItem({ client }: { client: Client }) {
  const [errored, setErrored] = useState(false)

  if (client.imgSrc && !errored) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-card">
        <img
          src={client.imgSrc}
          alt={client.name}
          onError={() => setErrored(true)}
          style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain' }}
        />
      </div>
    )
  }

  return (
    <div
      className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-card"
    >
      <span
        className="text-lg font-extrabold"
        style={{ color: client.color ?? '#f97316' }}
      >
        {client.initials}
      </span>
    </div>
  )
}

export default function TrustedBy() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      {clients.map((c) => (
        <LogoItem key={c.name} client={c} />
      ))}
    </div>
  )
}
