import { requireAdminUser } from "@/lib/admin-session"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const adminUser = await requireAdminUser()

  return (
    <div className="min-h-screen bg-muted flex">
      <AdminSidebar role={adminUser.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar user={adminUser} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
