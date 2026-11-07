// Public server function that returns a short-lived download link for a book
// that has an uploaded PDF/EPUB file.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getBookDownloadUrl = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ book_id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { createServerPublicSupabase } = await import("./supabase-public.server");
    const db: any = createServerPublicSupabase();
    const { data: book, error } = await db
      .from("books")
      .select("id, title, file_url, file_kind, active")
      .eq("id", data.book_id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!book || !book.active || !book.file_url) throw new Error("This book has no downloadable file.");

    if (/^https?:/i.test(book.file_url)) {
      return { url: book.file_url, kind: book.file_kind ?? "pdf", title: book.title };
    }
    const { data: signed, error: signErr } = await db.storage
      .from("book-files")
      .createSignedUrl(book.file_url, 600, { download: `${book.title}.${book.file_kind ?? "pdf"}` });
    if (signErr || !signed?.signedUrl) throw new Error(signErr?.message || "Could not create download link");
    return { url: signed.signedUrl, kind: book.file_kind ?? "pdf", title: book.title };
  });
