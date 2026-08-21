import Link from 'next/link'

export const metadata = {
  title: 'Admin access | Opus Zimbabwe',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return (
    <main className="min-h-[70vh] bg-dark px-6 py-20 text-light">
      <div className="mx-auto flex max-w-md flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Opus Zimbabwe</p>
          <h1 className="text-3xl font-bold">Admin access</h1>
          <p className="text-sm leading-6 text-light/70">
            The admin authentication service is not configured yet. No credentials are created by this placeholder.
          </p>
        </div>
        <div className="rounded-2xl border border-light/15 bg-light/5 p-6">
          <p className="text-sm leading-6 text-light/80">
            Configure the production session contract before enabling dashboard access. Public site functionality remains available.
          </p>
        </div>
        <Link className="text-sm font-semibold text-primary hover:text-light" href="/">
          Return to public site
        </Link>
      </div>
    </main>
  )
}
