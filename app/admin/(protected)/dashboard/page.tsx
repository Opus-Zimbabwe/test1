import Link from "next/link"
import { requireAdminUser } from "@/lib/admin-session"
import { db } from "@/lib/db"
import { partners, projects, media } from "@/lib/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Handshake, FolderKanban, ImageIcon, ArrowRight } from "lucide-react"

export const metadata = { title: "Dashboard — Opus Zimbabwe Admin" }

export default async function AdminDashboardPage() {
  const adminUser = await requireAdminUser()

  const [partnerRows, projectRows, mediaRows] = await Promise.all([
    db.select().from(partners),
    db.select().from(projects),
    db.select().from(media),
  ])

  const stats = [
    {
      label: "Partners",
      count: partnerRows.length,
      published: partnerRows.filter((p) => p.isPublished).length,
      href: "/admin/partners",
      icon: Handshake,
    },
    {
      label: "Projects",
      count: projectRows.length,
      published: projectRows.filter((p) => p.isPublished).length,
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      label: "Media files",
      count: mediaRows.length,
      published: null,
      href: "/admin/media",
      icon: ImageIcon,
    },
  ]

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-dark">Welcome back, {adminUser.name.split(" ")[0]}</h1>
      <p className="text-muted-fg text-sm mt-1">
        Here&apos;s a snapshot of the content on opuszimbabwe.co.zw.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-fg">{stat.label}</CardTitle>
                  <Icon size={18} className="text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-dark">{stat.count}</div>
                  {stat.published !== null && (
                    <p className="text-xs text-muted-fg mt-1">{stat.published} published</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick links</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/admin/projects"
            className="flex items-center justify-between rounded-lg border border-border p-4 hover:border-primary/50 text-sm font-medium"
          >
            Add a new project
            <ArrowRight size={16} className="text-primary" />
          </Link>
          <Link
            href="/admin/partners"
            className="flex items-center justify-between rounded-lg border border-border p-4 hover:border-primary/50 text-sm font-medium"
          >
            Add a new partner
            <ArrowRight size={16} className="text-primary" />
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
