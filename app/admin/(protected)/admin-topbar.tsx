"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { LogOut, Menu, X } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AdminUser } from "@/lib/admin-session"
import { AdminMobileNav } from "./admin-mobile-nav"

const roleLabel: Record<string, string> = {
  owner: "Owner",
  editor: "Editor",
  support: "Support",
}

export function AdminTopbar({ user }: { user: AdminUser }) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-3">
        <button
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className="md:hidden text-dark"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
        <span className="text-sm text-muted-fg hidden sm:inline">
          Signed in as <span className="font-medium text-dark">{roleLabel[user.role]}</span>
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-muted">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-dark hidden sm:inline">{user.name}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-fg font-normal">{user.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/" target="_blank">
              View site
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} variant="destructive">
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {mobileOpen && <AdminMobileNav role={user.role} onNavigate={() => setMobileOpen(false)} />}
    </header>
  )
}
