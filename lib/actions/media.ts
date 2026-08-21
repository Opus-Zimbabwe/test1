"use server"

import { db } from "@/lib/db"
import { media } from "@/lib/db/schema"
import { requireAdminUser } from "@/lib/admin-session"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { del } from "@vercel/blob"

export async function getMedia() {
  return db.select().from(media).orderBy(desc(media.createdAt))
}

export async function recordMediaUpload(input: {
  url: string
  pathname: string
  filename: string
  contentType?: string
  sizeBytes?: number
  altText?: string
}) {
  const admin = await requireAdminUser(["owner", "editor"])
  await db.insert(media).values({
    url: input.url,
    pathname: input.pathname,
    filename: input.filename,
    contentType: input.contentType,
    sizeBytes: input.sizeBytes,
    altText: input.altText,
    uploadedBy: admin.id,
  })
  revalidatePath("/admin/media")
}

export async function deleteMedia(id: number) {
  await requireAdminUser(["owner", "editor"])
  const [item] = await db.select().from(media).where(eq(media.id, id))
  if (item) {
    try {
      await del(item.url)
    } catch {
      // Blob may already be gone; ignore and proceed to remove the DB record.
    }
    await db.delete(media).where(eq(media.id, id))
  }
  revalidatePath("/admin/media")
}
