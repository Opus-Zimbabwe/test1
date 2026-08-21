import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getAdminUser } from "@/lib/admin-session"
import { db } from "@/lib/db"
import { media } from "@/lib/db/schema"

export async function POST(request: NextRequest) {
  const admin = await getAdminUser()
  if (!admin || (admin.role !== "owner" && admin.role !== "editor")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 })
    }

    const MAX_BYTES = 8 * 1024 * 1024
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File is too large (max 8MB)" }, { status: 400 })
    }

    const blob = await put(`opuszim/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    const [record] = await db
      .insert(media)
      .values({
        url: blob.url,
        pathname: blob.pathname,
        filename: file.name,
        contentType: file.type,
        sizeBytes: file.size,
        uploadedBy: admin.id,
      })
      .returning()

    return NextResponse.json({ media: record })
  } catch (error) {
    console.error("[v0] Media upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
