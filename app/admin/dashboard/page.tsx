import { desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contactSubmissions } from '@/lib/db/schema'

export const metadata = {
  title: 'Dashboard | Opus Zimbabwe',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const enquiries = await db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt))
    .limit(25)

  return (
    <main className="min-h-[70vh] bg-dark px-6 py-20 text-light">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Admin dashboard</p>
          <h1 className="text-3xl font-bold">Operations overview</h1>
          <p className="text-sm text-light/60">Recent enquiries captured from the public contact form.</p>
        </div>
        <section className="overflow-hidden rounded-2xl border border-light/15 bg-light/5">
          <div className="flex items-center justify-between border-b border-light/10 px-5 py-4">
            <h2 className="font-semibold">Enquiries</h2>
            <span className="text-sm text-light/60">{enquiries.length} shown</span>
          </div>
          {enquiries.length === 0 ? (
            <p className="px-5 py-8 text-sm text-light/60">No enquiries yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-light/10">
              {enquiries.map((enquiry) => (
                <article className="flex flex-col gap-2 px-5 py-4 md:flex-row md:items-start md:justify-between" key={enquiry.id}>
                  <div>
                    <p className="font-semibold">{enquiry.name}</p>
                    <p className="text-sm text-light/65">{enquiry.email}{enquiry.phone ? ` · ${enquiry.phone}` : ''}</p>
                    <p className="mt-2 text-sm text-light/80">{enquiry.message}</p>
                  </div>
                  <div className="shrink-0 text-left text-sm text-light/60 md:text-right">
                    <p>{enquiry.service}</p>
                    <p>{enquiry.status}</p>
                    <time dateTime={enquiry.createdAt.toISOString()}>{enquiry.createdAt.toLocaleDateString()}</time>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
