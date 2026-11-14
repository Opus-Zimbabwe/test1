import { siteExperienceSchema } from "./site-experience";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Only the verifier is stored in source; never send it to the browser.
async function assertPasscode(code: string) {
  const { createHash, timingSafeEqual } = await import("node:crypto");
  const verifier =
    process.env["SITE_ADMIN_PASSWORD_SHA256"] ||
    "094fb170f2881ac8006d8a3bafdacf695062b6cd24a00e62b43eb50b856ac1f8";
  if (!/^[a-f0-9]{64}$/i.test(verifier))
    throw new Error("Admin sign-in is temporarily unavailable.");
  const expected = Buffer.from(verifier, "hex");
  const actual = createHash("sha256").update(code).digest();
  if (!timingSafeEqual(actual, expected)) throw new Error("Invalid passcode");
}

export const verifySiteAdminPasscode = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ passcode: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await assertPasscode(data.passcode);
    return { ok: true };
  });

// Image upload (from the admin's device) into the gallery / announcements buckets.
function extFromMime(mime: string) {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("svg")) return "svg";
  return "jpg";
}

export const uploadSiteImage = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        passcode: z.string(),
        bucket: z.enum(["gallery", "announcements"]),
        data_url: z.string().startsWith("data:"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    await assertPasscode(data.passcode);
    const m = data.data_url.match(/^data:([^;]+);base64,(.+)$/);
    if (!m) throw new Error("Unsupported image data");
    const mime = m[1];
    if (!mime || !m[2]) throw new Error("Invalid image data");
    if (!mime.startsWith("image/")) throw new Error("Only image files are allowed");
    const bytes = Buffer.from(m[2], "base64");
    if (bytes.byteLength > 12 * 1024 * 1024) throw new Error("Image is larger than 12MB");

    const { createServerPublicSupabase } = await import("./supabase-public.server");
    const storageClient = createServerPublicSupabase();
    const path = `${data.bucket === "gallery" ? "gallery" : "announcements"}/${crypto.randomUUID()}.${extFromMime(mime)}`;
    const { error } = await storageClient.storage
      .from(data.bucket)
      .upload(path, bytes, { contentType: mime, upsert: false });
    if (error) throw new Error(`Upload failed: ${error.message}`);
    return { path };
  });

// Gallery
const gallerySchema = z.object({
  passcode: z.string(),
  id: z.string().optional(),
  src: z.string().min(1),
  caption: z.string().optional().nullable(),
  sort_order: z.number().optional(),
});
export const saveGalleryImage = createServerFn({ method: "POST" })
  .inputValidator((d) => gallerySchema.parse(d))
  .handler(async ({ data }) => {
    await assertPasscode(data.passcode);
    const { createServerPublicSupabase } = await import("./supabase-public.server");
    const supabase = createServerPublicSupabase();
    const payload = {
      src: data.src,
      caption: data.caption ?? null,
      sort_order: data.sort_order ?? 0,
    };
    if (data.id) {
      const { data: row, error } = await (supabase as any).rpc("site_admin_save_gallery_image", {
        _passcode: data.passcode,
        _id: data.id,
        _src: payload.src,
        _caption: payload.caption,
        _sort_order: payload.sort_order,
      } as never);
      if (error) throw error;
      return row;
    }
    const { data: row, error } = await (supabase as any).rpc("site_admin_save_gallery_image", {
      _passcode: data.passcode,
      _id: null,
      _src: payload.src,
      _caption: payload.caption,
      _sort_order: payload.sort_order,
    } as never);
    if (error) throw error;
    return row;
  });

export const deleteGalleryImage = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ passcode: z.string(), id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await assertPasscode(data.passcode);
    const { createServerPublicSupabase } = await import("./supabase-public.server");
    const supabase = createServerPublicSupabase();
    const { error } = await (supabase as any).rpc("site_admin_delete_gallery_image", {
      _passcode: data.passcode,
      _id: data.id,
    });
    if (error) throw error;
    return { ok: true };
  });

// Announcements
const annSchema = z.object({
  passcode: z.string(),
  id: z.string().optional(),
  title: z.string().min(1),
  body: z.string(),
  date_text: z.string(),
  location: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  sort_order: z.number().optional(),
});
export const saveAnnouncement = createServerFn({ method: "POST" })
  .inputValidator((d) => annSchema.parse(d))
  .handler(async ({ data }) => {
    await assertPasscode(data.passcode);
    const { createServerPublicSupabase } = await import("./supabase-public.server");
    const supabase = createServerPublicSupabase();
    const payload = {
      title: data.title,
      body: data.body,
      date_text: data.date_text,
      location: data.location ?? null,
      image_url: data.image_url ?? null,
      sort_order: data.sort_order ?? 0,
    };
    if (data.id) {
      const { data: row, error } = await (supabase as any).rpc("site_admin_save_announcement", {
        _passcode: data.passcode,
        _id: data.id,
        _title: payload.title,
        _body: payload.body,
        _date_text: payload.date_text,
        _location: payload.location,
        _image_url: payload.image_url,
        _sort_order: payload.sort_order,
      } as never);
      if (error) throw error;
      return row;
    }
    const { data: row, error } = await (supabase as any).rpc("site_admin_save_announcement", {
      _passcode: data.passcode,
      _id: null,
      _title: payload.title,
      _body: payload.body,
      _date_text: payload.date_text,
      _location: payload.location,
      _image_url: payload.image_url,
      _sort_order: payload.sort_order,
    } as never);
    if (error) throw error;
    return row;
  });

export const deleteAnnouncement = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ passcode: z.string(), id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await assertPasscode(data.passcode);
    const { createServerPublicSupabase } = await import("./supabase-public.server");
    const supabase = createServerPublicSupabase();
    const { error } = await (supabase as any).rpc("site_admin_delete_announcement", {
      _passcode: data.passcode,
      _id: data.id,
    });
    if (error) throw error;
    return { ok: true };
  });

const videoSchema = z.object({
  passcode: z.string(),
  id: z.string().uuid().optional(),
  origin_key: z
    .string()
    .regex(/^(podcast|social):(youtube|tiktok|facebook):[\w-]{5,80}$/)
    .nullable()
    .optional(),
  url: z.string().url().max(2048),
  title: z.string().trim().min(1).max(180),
  placement: z.enum(["podcast", "social"]),
  sort_order: z.number().int().min(-10000).max(10000),
  active: z.boolean(),
});
export const saveContentVideo = createServerFn({ method: "POST" })
  .inputValidator((data) => videoSchema.parse(data))
  .handler(async ({ data }) => {
    await assertPasscode(data.passcode);
    const { parseVideoLink } = await import("./video-library");
    const parsed = parseVideoLink(data.url);
    const { createServerPublicSupabase } = await import("./supabase-public.server");
    const client = createServerPublicSupabase();
    const { passcode, ...fields } = data;
    const { data: record, error } = await client.rpc(
      "site_admin_save_video" as never,
      {
        _passcode: passcode,
        _video: {
          ...fields,
          platform: parsed.platform,
          video_id: parsed.id,
          url: parsed.url,
          origin_key: fields.origin_key || `${fields.placement}:${parsed.platform}:${parsed.id}`,
        },
      } as never,
    );
    if (error)
      throw new Error(
        error.code === "PGRST202"
          ? "Video publishing needs the content_videos database migration. Your changes have not been published."
          : error.message,
      );
    return record as unknown as import("./video-library").VideoRecord;
  });

export const saveSiteExperience = createServerFn({ method: "POST" })
  .inputValidator((input) => {
    return z
      .object({
        passcode: z.string(),
        section: z.enum(["hero", "availability", "message"]),
        settings: siteExperienceSchema,
      })
      .parse(input);
  })
  .handler(async ({ data }) => {
    await assertPasscode(data.passcode);
    const { siteInstanceId, clearExperienceCache } = await import("./site-experience.server");
    const { createServerPublicSupabase } = await import("./supabase-public.server");
    const { error } = await createServerPublicSupabase().rpc(
      "site_admin_save_experience" as never,
      {
        _passcode: data.passcode,
        _site_key: siteInstanceId(),
        _section: data.section,
        _settings: data.settings,
      } as never,
    );
    if (error)
      throw Error(
        error.code === "PGRST202"
          ? "Website controls need the site_experience database migration. Nothing has been changed."
          : error.message,
      );
    clearExperienceCache();
    return { ok: true };
  });
