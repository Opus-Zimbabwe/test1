"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { AdminRole } from "@/lib/admin-session"
import {
  LayoutDashboard,
  Handshake,
  FolderKanban,
  ImageIcon,
  Users,
  Globe,
} from "lucide-react"

const navItems: {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  roles: AdminRole[]
}[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["owner", "editor", "support"],
  },
  {
    label: "Partners",
    href: "/admin/partners",
    icon: Handshake,
    roles: ["owner", "editor"],
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
    roles: ["owner", "editor"],
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: ImageIcon,
    roles: ["owner", "editor"],
  },
  {
    label: "Admin Users",
    href: "/admin/settings/users",
    icon: Users,
    roles: ["owner"],
  },
]

export function AdminSidebar({ role }: { role: AdminRole }) {
  const pathname = usePathname()
  const items = navItems.filter((item) => item.roles.includes(role))

  return (
    <aside className="hidden md:flex w-60 flex-col bg-dark text-white shrink-0">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
        <Image
          src="/images/logo.png"
          alt="Opus Zimbabwe icon"
          width={28}
          height={28}
          className="h-7 w-7 rounded-full"
        />
        <span className="font-bold text-sm">Opus Admin</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Globe size={18} />
          View site
        </Link>
      </div>
    </aside>
  )
}
