import { DEFAULT_EXPERIENCE, siteExperienceSchema, type SiteExperience } from "./site-experience";
let cache: { settings: SiteExperience; available: boolean; expires: number } | null = null;
export function siteInstanceId() {
  const value = process.env["SITE_INSTANCE_ID"] || "greatcouples-test";
  if (!/^[\w-]{1,80}$/.test(value)) throw Error("Invalid website instance");
  return value;
}
export function clearExperienceCache() {
  cache = null;
}
export async function loadSiteExperience() {
  if (cache && cache.expires > Date.now()) return cache;
  try {
    const { createServerPublicSupabase } = await import("./supabase-public.server");
    const { data, error } = await createServerPublicSupabase()
      .from("site_experience" as never)
      .select("settings")
      .eq("site_key", siteInstanceId())
      .abortSignal(AbortSignal.timeout(3000))
      .maybeSingle();
    if (error) throw error;
    const row = data as unknown as { settings: unknown } | null;
    cache = {
      settings: row ? siteExperienceSchema.parse(row.settings) : DEFAULT_EXPERIENCE,
      available: true,
      expires: Date.now() + 15000,
    };
  } catch {
    cache = {
      settings: cache?.settings || DEFAULT_EXPERIENCE,
      available: false,
      expires: Date.now() + 5000,
    };
  }
  return cache;
}
export async function maintenanceState() {
  const state = await loadSiteExperience();
  return {
    ...state.settings.maintenance,
    enabled: process.env["SITE_MAINTENANCE_MODE"] === "true" || state.settings.maintenance.enabled,
  };
}
export async function assertWebsiteOpen() {
  if ((await maintenanceState()).enabled)
    throw Error("The website is temporarily unavailable. Please try again later.");
}
export { maintenanceExempt } from "./maintenance-paths";
export function maintenanceResponse(message: string) {
  const safe = message.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Back soon — Great Couples</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f9f5fa;color:#40204d;font:20px/1.7 system-ui,sans-serif}main{max-width:650px;padding:45px}h1{font-size:clamp(45px,9vw,80px);line-height:1.05;letter-spacing:-.05em}a{color:#ad1752;font-size:16px}img{width:190px}</style><main><img src="/images/gc-logo-transparent.png" alt="Great Couples"><h1>We’ll be back soon.</h1><p>${safe}</p><a href="/admin">Admin sign in</a></main></html>`,
    {
      status: 503,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "retry-after": "900",
        "x-robots-tag": "noindex",
      },
    },
  );
}
