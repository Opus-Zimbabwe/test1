import { useRef, useState } from "react";
import { Upload, Link2, Loader2, Trash2 } from "lucide-react";
import { useSignedImageUrl } from "@/lib/db";

/**
 * Image field with two sources: upload from this device, or paste a URL.
 * Uploads happen immediately so the change is live as soon as you save.
 */
export function ImagePicker({
  value,
  bucket,
  label = "Image",
  onChange,
  onUpload,
}: {
  value: string;
  bucket: string;
  label?: string;
  onChange: (v: string) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = useSignedImageUrl(value, bucket);

  const pick = async (file: File) => {
    setErr("");
    if (!file.type.startsWith("image/")) { setErr("Please choose an image file"); return; }
    if (file.size > 12 * 1024 * 1024) { setErr("Image is larger than 12MB"); return; }
    setBusy(true);
    try {
      const path = await onUpload(file);
      onChange(path);
    } catch (e: any) {
      setErr(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };


  return (
    <div className="rounded-2xl border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
        <div className="inline-flex rounded-full bg-muted p-0.5 text-xs font-semibold">
          <button type="button" onClick={() => setMode("upload")} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${mode === "upload" ? "bg-background shadow" : "text-muted-foreground"}`}>
            <Upload className="h-3 w-3" /> Upload
          </button>
          <button type="button" onClick={() => setMode("url")} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${mode === "url" ? "bg-background shadow" : "text-muted-foreground"}`}>
            <Link2 className="h-3 w-3" /> URL
          </button>
        </div>
      </div>

      <div className="mt-3">
        {mode === "upload" ? (
          <div className="flex items-center gap-3">
            <input ref={inputRef} type="file" accept="image/*" className="text-sm" disabled={busy}
              onChange={e => e.target.files?.[0] && pick(e.target.files[0])} />
            {busy && <span className="inline-flex items-center gap-1 text-xs text-primary"><Loader2 className="h-3 w-3 animate-spin" /> Uploading…</span>}
          </div>
        ) : (
          <input type="url" value={/^https?:/i.test(value) ? value : ""} placeholder="https://example.com/photo.jpg"
            onChange={e => onChange(e.target.value)}
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        )}
      </div>

      {err && <p className="mt-2 text-xs text-accent">{err}</p>}

      {value && (
        <div className="mt-3 flex items-start gap-3">
          {preview
            ? <img src={preview} alt="" className="h-28 w-28 rounded-xl object-cover ring-1 ring-border" />
            : <div className="h-28 w-28 grid place-items-center rounded-xl bg-muted text-xs text-muted-foreground">Loading…</div>}
          <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
            <Trash2 className="h-3 w-3" /> Remove
          </button>
        </div>
      )}
    </div>
  );
}
