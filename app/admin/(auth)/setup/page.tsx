import { redirect } from "next/navigation"
import { countAdminUsers } from "@/lib/actions/admin-users"
import { SetupForm } from "./setup-form"

export const metadata = { title: "Admin Setup — Opus Zimbabwe" }

export default async function AdminSetupPage() {
  const userCount = await countAdminUsers()
  if (userCount > 0) redirect("/admin/login")

  return (
    <main className="min-h-screen flex items-center justify-center bg-dark px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
            OZ
          </div>
          <h1 className="text-white text-xl font-bold mt-4">Create the owner account</h1>
          <p className="text-white/60 text-sm mt-1">
            This is a one-time setup for the first administrator.
          </p>
        </div>
        <SetupForm />
      </div>
    </main>
  )
}
