// Realtime data layer backed by Lovable Cloud.
// Public reads use the browser supabase client directly (RLS-safe: public SELECT on gallery/announcements/books).
// Writes go through server functions or (for the secret site admin) a passcode-gated server fn.
import { useCallback, useEffect, useState } from "react";
import { supabase as _supabase, getOptionalSupabaseClient } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
const supabase = _supabase;

export function useSignedImageUrl(src: string | null | undefined, bucket: string) {
  const [url, setUrl] = useState<string>(src && /^(https?:|data:|\/)/i.test(src) ? src : "");
  useEffect(() => {
    let cancelled = false;
    if (!src) {
      setUrl("");
      return;
    }
    if (/^(https?:|data:|\/)/i.test(src)) {
      setUrl(src);
      return;
    }
    setUrl("");
    const client = getOptionalSupabaseClient();
    if (!client) return;
    client.storage
      .from(bucket)
      .createSignedUrl(src, 3600)
      .then(({ data }) => {
        if (!cancelled) setUrl(data?.signedUrl || "");
      })
      .catch(() => {
        if (!cancelled) setUrl("");
      });
    return () => {
      cancelled = true;
    };
  }, [src, bucket]);
  return url;
}

export type GalleryImage = {
  id: string;
  src: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};
export type Announcement = {
  id: string;
  title: string;
  body: string;
  date_text: string;
  location: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
};
export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  price_usd: number;
  isbn: string | null;
  cover_url: string | null;
  file_url: string | null;
  file_kind: string | null;
  active: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
};
export type OrderRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: { book_id: string; title: string; price_usd: number; qty: number }[];
  total_usd: number;
  method: string;
  status: string;
  paynow_reference: string | null;
  paynow_poll_url: string | null;
  paynow_instructions: string | null;
  created_at: string;
  updated_at: string;
};
export type NotificationRow = {
  id: string;
  kind: string;
  title: string;
  body: string;
  meta: unknown;
  read: boolean;
  created_at: string;
};

function useRealtimeList<T>(
  table: keyof Database["public"]["Tables"],
  order: string,
  ascending = true,
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);
  useEffect(() => {
    const client = getOptionalSupabaseClient() as typeof supabase | null;
    if (!client) {
      setRows([]);
      setError("Content connection is not configured.");
      setLoading(false);
      return;
    }
    let mounted = true;
    const load = async () => {
      try {
        let query = client.from(table).select("*").order(order, { ascending });
        if (order !== "created_at") query = query.order("created_at", { ascending: false });
        const { data, error: readError } = await query;
        if (readError) throw readError;
        if (mounted) {
          setRows((data ?? []) as T[]);
          setError(null);
        }
      } catch (readError) {
        // Keep last-known-good content when a request fails.
        if (mounted)
          setError(
            readError instanceof Error ? readError.message : "Content could not be refreshed.",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    const channel = client
      .channel(`realtime:${table}:${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, load)
      .subscribe();
    // Safety net so content still refreshes if the realtime socket drops.
    const poll = setInterval(load, 15000);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      mounted = false;
      clearInterval(poll);
      window.removeEventListener("focus", onFocus);
      client.removeChannel(channel);
    };
  }, [table, order, ascending, tick]);
  return { rows, loading, refresh, error };
}

/** Upload a file straight from the admin's device to storage (fast, no server round-trip). */
export async function uploadFileToBucket(file: File, bucket: string, folder = bucket) {
  const ext =
    (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
}

export const uploadImageToBucket = uploadFileToBucket;

export const useGalleryImages = () =>
  useRealtimeList<GalleryImage>("gallery_images", "sort_order", true);
export const useAnnouncements = () =>
  useRealtimeList<Announcement>("announcements", "sort_order", true);
export const useBooks = () => useRealtimeList<Book>("books", "created_at", false);
export const useOrders = () => useRealtimeList<OrderRow>("orders", "created_at", false);
export const useNotifications = () =>
  useRealtimeList<NotificationRow>("notifications", "created_at", false);

export function useAppConfig() {
  const [cfg, setCfg] = useState<{
    paynow_integration_id: string | null;
    paynow_key_configured: boolean;
    client_admin_email: string | null;
  } | null>(null);
  useEffect(() => {
    const client = getOptionalSupabaseClient();
    if (!client) return;
    client
      .from("app_config")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }: { data: unknown }) => setCfg(data as typeof cfg));
  }, []);
  return cfg;
}
