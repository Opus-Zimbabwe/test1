import Link from "next/link"
import Image from "next/image"
import { requireAdminUser } from "@/lib/admin-session"
import { getProjects } from "@/lib/actions/projects"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { FolderKanbanIcon, PlusIcon } from "lucide-react"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  completed: "default",
  ongoing: "secondary",
  draft: "outline",
}

export default async function AdminProjectsPage() {
  await requireAdminUser(["owner", "editor", "support"])
  const projects = await getProjects()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-dark">Projects</h1>
          <p className="text-sm text-muted-fg">
            Manage the case studies shown on the public Projects page.
          </p>
        </div>
        <Button render={<Link href="/admin/projects/new" />}>
          <PlusIcon data-icon="inline-start" />
          New project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderKanbanIcon />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>Create your first project to show it on the public site.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    {project.coverImageUrl ? (
                      <Image
                        src={project.coverImageUrl}
                        alt={`${project.title} cover`}
                        width={48}
                        height={36}
                        className="h-9 w-12 rounded object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-9 w-12 items-center justify-center rounded bg-muted text-muted-fg">
                        <FolderKanbanIcon className="size-4" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell className="text-muted-fg">{project.category ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[project.status] ?? "outline"}>{project.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.isPublished ? "default" : "secondary"}>
                      {project.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" render={<Link href={`/admin/projects/${project.id}`} />}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
