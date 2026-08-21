import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { countAdminUsers } from "@/lib/actions/admin-users"
import { LoginForm } from "./login-form"

export const metadata = { title: "Admin Sign In — Opus Zimbabwe" }

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect("/admin/dashboard")

  const userCount = await countAdminUsers()
  if (userCount === 0) redirect("/admin/setup")

  return (
    <main className="min-h-screen flex items-center justify-center bg-dark px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
            OZ
          </div>
          <h1 className="text-white text-xl font-bold mt-4">Opus Zimbabwe Admin</h1>
          <p className="text-white/60 text-sm mt-1">Sign in to manage your site</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
