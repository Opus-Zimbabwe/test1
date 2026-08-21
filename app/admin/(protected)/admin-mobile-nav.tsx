"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { AdminRole } from "@/lib/admin-session"
import { LayoutDashboard, Handshake, FolderKanban, ImageIcon, Users } from "lucide-react"

const navItems: {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  roles: AdminRole[]
}[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, roles: ["owner", "editor", "support"] },
  { label: "Partners", href: "/admin/partners", icon: Handshake, roles: ["owner", "editor"] },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban, roles: ["owner", "editor"] },
  { label: "Media", href: "/admin/media", icon: ImageIcon, roles: ["owner", "editor"] },
  { label: "Admin Users", href: "/admin/settings/users", icon: Users, roles: ["owner"] },
]

export function AdminMobileNav({
  role,
  onNavigate,
}: {
  role: AdminRole
  onNavigate: () => void
}) {
  const pathname = usePathname()
  const items = navItems.filter((item) => item.roles.includes(role))

  return (
    <nav className="absolute top-16 left-0 right-0 bg-dark text-white p-4 space-y-1 md:hidden z-40 shadow-lg">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/")
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
              active ? "bg-primary text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
