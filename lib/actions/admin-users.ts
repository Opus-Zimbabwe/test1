"use server"

import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { requireAdminUser } from "@/lib/admin-session"
import { asc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const roleSchema = z.enum(["owner", "editor", "support"])

export async function getAdminUsers() {
  await requireAdminUser(["owner"])
  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(asc(user.createdAt))
}

export async function countAdminUsers() {
  const rows = await db.select({ id: user.id }).from(user)
  return rows.length
}

const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: roleSchema,
})

export async function createAdminUser(formData: FormData) {
  await requireAdminUser(["owner"])

  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      },
    })

    if (!result?.user?.id) {
      return { error: "Could not create the account" }
    }

    await db.update(user).set({ role: parsed.data.role }).where(eq(user.id, result.user.id))
  } catch {
    return { error: "An account with that email may already exist" }
  }

  revalidatePath("/admin/settings/users")
  return { success: true }
}

const bootstrapSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

/**
 * Creates the very first admin account with the "owner" role. Only works
 * when there are zero users in the system — guards against re-use.
 */
export async function bootstrapOwnerAccount(formData: FormData) {
  const existing = await countAdminUsers()
  if (existing > 0) {
    return { error: "Setup has already been completed" }
  }

  const parsed = bootstrapSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const result = await auth.api.signUpEmail({
    body: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    },
  })

  if (!result?.user?.id) {
    return { error: "Could not create the account" }
  }

  await db.update(user).set({ role: "owner" }).where(eq(user.id, result.user.id))
  return { success: true }
}

export async function updateAdminUserRole(id: string, role: string) {
  const admin = await requireAdminUser(["owner"])
  const parsedRole = roleSchema.safeParse(role)
  if (!parsedRole.success) return { error: "Invalid role" }

  if (admin.id === id && parsedRole.data !== "owner") {
    return { error: "You cannot remove your own owner role" }
  }

  await db.update(user).set({ role: parsedRole.data }).where(eq(user.id, id))
  revalidatePath("/admin/settings/users")
  return { success: true }
}

export async function deleteAdminUser(id: string) {
  const admin = await requireAdminUser(["owner"])
  if (admin.id === id) {
    return { error: "You cannot delete your own account" }
  }
  await db.delete(user).where(eq(user.id, id))
  revalidatePath("/admin/settings/users")
  return { success: true }
}
