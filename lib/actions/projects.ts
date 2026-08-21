"use server"

import { db } from "@/lib/db"
import { projectImages, projects } from "@/lib/db/schema"
import { requireAdminUser } from "@/lib/admin-session"
import { asc, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z.string().trim().max(200).optional(),
  summary: z.string().trim().max(500).optional().nullable(),
  description: z.string().trim().max(10000).optional().nullable(),
  location: z.string().trim().max(200).optional().nullable(),
  category: z.string().trim().max(100).optional().nullable(),
  status: z.enum(["draft", "ongoing", "completed"]).default("draft"),
  coverImageUrl: z.string().trim().max(1000).optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.coerce.boolean().default(false),
})

export async function getProjects() {
  return db.select().from(projects).orderBy(asc(projects.sortOrder), desc(projects.createdAt))
}

export async function getPublishedProjects() {
  return db
    .select()
    .from(projects)
    .where(eq(projects.isPublished, true))
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt))
}

export async function getProjectById(id: number) {
  const [project] = await db.select().from(projects).where(eq(projects.id, id))
  if (!project) return null
  const images = await db
    .select()
    .from(projectImages)
    .where(eq(projectImages.projectId, id))
    .orderBy(asc(projectImages.sortOrder))
  return { ...project, images }
}

export async function getProjectBySlug(slug: string) {
  const [project] = await db.select().from(projects).where(eq(projects.slug, slug))
  if (!project) return null
  const images = await db
    .select()
    .from(projectImages)
    .where(eq(projectImages.projectId, project.id))
    .orderBy(asc(projectImages.sortOrder))
  return { ...project, images }
}

async function uniqueSlug(base: string, ignoreId?: number) {
  let slug = slugify(base) || `project-${Date.now()}`
  let suffix = 1
  while (true) {
    const rows = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, slug))
    const conflict = rows.find((r) => r.id !== ignoreId)
    if (!conflict) return slug
    suffix += 1
    slug = `${slugify(base)}-${suffix}`
  }
}

export async function createProject(formData: FormData) {
  await requireAdminUser(["owner", "editor"])

  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    summary: formData.get("summary") || null,
    description: formData.get("description") || null,
    location: formData.get("location") || null,
    category: formData.get("category") || null,
    status: formData.get("status") || "draft",
    coverImageUrl: formData.get("coverImageUrl") || null,
    sortOrder: formData.get("sortOrder") || 0,
    isPublished: formData.get("isPublished") === "on",
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const slug = await uniqueSlug(parsed.data.slug || parsed.data.title)
  const [created] = await db
    .insert(projects)
    .values({ ...parsed.data, slug })
    .returning({ id: projects.id })

  revalidatePath("/admin/projects")
  revalidatePath("/projects")
  revalidatePath("/")
  return { success: true, id: created.id }
}

export async function updateProject(id: number, formData: FormData) {
  await requireAdminUser(["owner", "editor"])

  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    summary: formData.get("summary") || null,
    description: formData.get("description") || null,
    location: formData.get("location") || null,
    category: formData.get("category") || null,
    status: formData.get("status") || "draft",
    coverImageUrl: formData.get("coverImageUrl") || null,
    sortOrder: formData.get("sortOrder") || 0,
    isPublished: formData.get("isPublished") === "on",
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const slug = await uniqueSlug(parsed.data.slug || parsed.data.title, id)
  await db
    .update(projects)
    .set({ ...parsed.data, slug, updatedAt: new Date() })
    .where(eq(projects.id, id))

  revalidatePath("/admin/projects")
  revalidatePath("/projects")
  revalidatePath("/")
  return { success: true }
}

export async function deleteProject(id: number) {
  await requireAdminUser(["owner", "editor"])
  await db.delete(projects).where(eq(projects.id, id))
  revalidatePath("/admin/projects")
  revalidatePath("/projects")
  revalidatePath("/")
}

export async function addProjectImage(projectId: number, imageUrl: string, caption?: string) {
  await requireAdminUser(["owner", "editor"])
  await db.insert(projectImages).values({ projectId, imageUrl, caption: caption || null })
  revalidatePath(`/admin/projects/${projectId}`)
}

export async function deleteProjectImage(imageId: number, projectId: number) {
  await requireAdminUser(["owner", "editor"])
  await db.delete(projectImages).where(eq(projectImages.id, imageId))
  revalidatePath(`/admin/projects/${projectId}`)
}
