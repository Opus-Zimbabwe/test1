// Server functions for the client admin (book store manager).
// All calls require an authenticated user with the 'client_admin' role.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string().default(""),
  price_usd: z.number().nonnegative(),
  isbn: z.string().optional().nullable(),
  stock: z.number().int().nonnegative().default(0),
  active: z.boolean().default(true),
  cover: z.string().optional().nullable(), // URL, data URL, or existing storage path
  file: z.string().optional().nullable(), // data URL for PDF/EPUB
  file_kind: z.enum(["pdf", "epub"]).optional().nullable(),
});


async function assertClientAdmin(context: { supabase: any; userId: string }) {
  const { data: ok } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "client_admin",
  });
  if (!ok) throw new Error("Forbidden: client admin role required");
}

function extFromMime(mime: string) {
  if (mime.includes("pdf")) return "pdf";
  if (mime.includes("epub")) return "epub";
  if (mime.includes("png")) return "png";
  if (mime.includes("jpg") || mime.includes("jpeg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  return "bin";
}

function decodeDataUrl(url: string): { buffer: Buffer; mime: string; ext: string } | null {
  const m = url.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return null;
  const mime = m[1];
  const buffer = Buffer.from(m[2], "base64");
  return { buffer, mime, ext: extFromMime(mime) };
}

async function uploadDataUrl(
  supabaseAdmin: any,
  bucket: string,
  folder: string,
  dataUrl: string,
): Promise<string> {
  const decoded = decodeDataUrl(dataUrl);
  if (!decoded) {
    // Not a data URL; assume it's an external URL or already a storage path.
    return dataUrl;
  }
  const path = `${folder}/${crypto.randomUUID()}.${decoded.ext}`;
  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, decoded.buffer, {
    contentType: decoded.mime,
    upsert: false,
  });
  if (error) throw new Error(`Upload to ${bucket} failed: ${error.message}`);
  return path;
}

export const listBooksAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertClientAdmin(context);
    const { data, error } = await context.supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const saveBook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => bookSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertClientAdmin(context);

    const cover_url = data.cover
      ? await uploadDataUrl(context.supabase, "book-covers", "covers", data.cover)
      : null;
    let file_url: string | null = null;
    let file_kind: string | null = data.file_kind ?? null;
    if (data.file) {
      file_url = await uploadDataUrl(context.supabase, "book-files", "books", data.file);
    }

    const payload: Record<string, unknown> = {
      title: data.title,
      author: data.author,
      description: data.description,
      price_usd: data.price_usd,
      isbn: data.isbn ?? null,
      stock: data.stock,
      active: data.active,
    };
    // Only overwrite media when new media was supplied, so editing text fields
    // never wipes an existing cover or book file.
    if (cover_url) payload.cover_url = cover_url;
    if (file_url) {
      payload.file_url = file_url;
      payload.file_kind = file_kind;
    }
    if (!data.id) {
      payload.cover_url = cover_url;
      payload.file_url = file_url;
      payload.file_kind = file_url ? file_kind : null;
    }


    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("books")
        .update(payload as never)
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw error;
      return row;
    }
    const { data: row, error } = await context.supabase.from("books").insert(payload as never).select("*").single();

    if (error) throw error;
    return row;
  });

export const deleteBook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertClientAdmin(context);
    const { error } = await context.supabase.from("books").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const listOrdersAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertClientAdmin(context);
    const { data, error } = await context.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string(), status: z.enum(["pending", "paid", "fulfilled", "cancelled", "failed"]) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertClientAdmin(context);
    const { error } = await context.supabase.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const listNotificationsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertClientAdmin(context);
    const { data, error } = await context.supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const markNotificationRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertClientAdmin(context);
    const { error } = await context.supabase.from("notifications").update({ read: true }).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertClientAdmin(context);
    const { error } = await context.supabase.from("notifications").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });