"use server"

import { db } from "@/lib/db"
import { partners } from "@/lib/db/schema"
import { requireAdminUser } from "@/lib/admin-session"
import { asc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const partnerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  logoUrl: z.string().trim().max(1000).optional().nullable(),
  websiteUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .refine((v) => !v || /^https?:\/\//.test(v), "Website URL must start with http:// or https://"),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.coerce.boolean().default(true),
})

export async function getPartners() {
  return db.select().from(partners).orderBy(asc(partners.sortOrder), asc(partners.id))
}

export async function getPublishedPartners() {
  return db
    .select()
    .from(partners)
    .where(eq(partners.isPublished, true))
    .orderBy(asc(partners.sortOrder), asc(partners.id))
}

export async function createPartner(formData: FormData) {
  await requireAdminUser(["owner", "editor"])

  const parsed = partnerSchema.safeParse({
    name: formData.get("name"),
    logoUrl: formData.get("logoUrl") || null,
    websiteUrl: formData.get("websiteUrl") || null,
    sortOrder: formData.get("sortOrder") || 0,
    isPublished: formData.get("isPublished") === "on",
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  await db.insert(partners).values(parsed.data)
  revalidatePath("/admin/partners")
  revalidatePath("/")
  return { success: true }
}

export async function updatePartner(id: number, formData: FormData) {
  await requireAdminUser(["owner", "editor"])

  const parsed = partnerSchema.safeParse({
    name: formData.get("name"),
    logoUrl: formData.get("logoUrl") || null,
    websiteUrl: formData.get("websiteUrl") || null,
    sortOrder: formData.get("sortOrder") || 0,
    isPublished: formData.get("isPublished") === "on",
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  await db
    .update(partners)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(partners.id, id))
  revalidatePath("/admin/partners")
  revalidatePath("/")
  return { success: true }
}

export async function deletePartner(id: number) {
  await requireAdminUser(["owner", "editor"])
  await db.delete(partners).where(eq(partners.id, id))
  revalidatePath("/admin/partners")
  revalidatePath("/")
}
