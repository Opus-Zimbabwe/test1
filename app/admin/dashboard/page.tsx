export const metadata = {
  title: 'Dashboard | Opus Zimbabwe',
  robots: { index: false, follow: false },
}

export default function AdminDashboard() {
  return (
    <main className="min-h-[70vh] bg-dark px-6 py-20 text-light">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Admin dashboard</p>
          <h1 className="text-3xl font-bold">Operations overview</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {['Enquiries', 'Projects', 'Partners', 'Settings'].map((item) => (
            <div className="rounded-2xl border border-light/15 bg-light/5 p-5" key={item}>
              <p className="font-semibold">{item}</p>
              <p className="mt-2 text-sm text-light/60">Available after authentication setup.</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
