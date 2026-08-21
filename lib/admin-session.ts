import "server-only"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export type AdminRole = "owner" | "editor" | "support"

export type AdminUser = {
  id: string
  name: string
  email: string
  role: AdminRole
}

/**
 * Returns the current session's user, or null if unauthenticated.
 * Use this in server components / actions that need optional auth state.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const role = ((session.user as { role?: string }).role ?? "editor") as AdminRole
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role,
  }
}

/**
 * Requires a signed-in admin user. Redirects to /admin/login if not authenticated.
 * Optionally restricts access to a set of allowed roles.
 */
export async function requireAdminUser(allowedRoles?: AdminRole[]): Promise<AdminUser> {
  const user = await getAdminUser()
  if (!user) redirect("/admin/login")
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect("/admin/dashboard?error=forbidden")
  }
  return user
}
