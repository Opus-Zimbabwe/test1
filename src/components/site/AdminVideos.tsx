import "./experience.css";
import { useMemo, useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Search, X, ArrowUpRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useVideoLibrary, mergeVideos } from "@/lib/use-video-library";
import { parseVideoLink, type VideoPlacement, type VideoRecord } from "@/lib/video-library";
import { saveContentVideo } from "@/lib/site-admin.functions";
import { clipLink, type MediaClip } from "./media";
import { BrandLogo } from "./BrandLogo";
import { MediaArtwork } from "./MediaArtwork";
type Draft = {
  origin_key?: string | null;
  id?: string;
  url: string;
  title: string;
  placement: VideoPlacement;
  sort_order: number;
  active: boolean;
};
const blank: Draft = { url: "", title: "", placement: "podcast", sort_order: 0, active: true };
export function AdminVideos() {
  const { data, isFetching, refetch } = useVideoLibrary();
  const save = useServerFn(saveContentVideo);
  const cache = useQueryClient();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [placement, setPlacement] = useState<VideoPlacement>("podcast");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const records = useMemo(() => data?.records || [], [data?.records]);
  const videos = useMemo(() => {
    const visible = mergeVideos(
      placement,
      records,
      (data?.youtube.videos || []) as MediaClip[],
    ).map((clip) => ({
      clip,
      record: records.find(
        (row) =>
          row.platform === clip.platform && row.video_id === clip.id && row.placement === placement,
      ),
    }));
    if (showHidden)
      for (const row of records.filter((row) => !row.active && row.placement === placement))
        visible.push({
          clip: { id: row.video_id, platform: row.platform, title: row.title, url: row.url },
          record: row,
        });
    return visible.filter(({ clip }) =>
      `${clip.title} ${clip.platform} ${clip.id}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [placement, records, data?.youtube.videos, showHidden, search]);
  const draftFor = (clip: MediaClip, record?: VideoRecord): Draft => ({
    ...(record ? { id: record.id } : {}),
    url: clipLink(clip),
    title: clip.title,
    placement,
    sort_order: record?.sort_order ?? 0,
    active: record?.active ?? true,
    origin_key: record?.origin_key || `${placement}:${clip.platform}:${clip.id}`,
  });
  async function publish(draft: Draft) {
    setBusy(true);
    setError("");
    try {
      await save({ data: { ...draft, passcode: sessionStorage.getItem("gc_site_admin") || "" } });
      await cache.invalidateQueries({ queryKey: ["video-library"] });
      setNotice("Video saved. The website library is updated.");
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the video.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="gc-admin-videos">
      <div className="gc-admin-video-heading">
        <div>
          <h2>Videos & podcast</h2>
          <p>Paste a video link. Choose where it appears. Keep every conversation in order.</p>
        </div>
        <button
          className="gc-admin-primary"
          onClick={() => {
            setEditing({ ...blank, placement });
            setError("");
            setNotice("");
          }}
        >
          <Plus size={19} />
          Add video
        </button>
      </div>
      <div className="gc-admin-sync">
        <BrandLogo brand="youtube" size={36} />
        <div>
          <strong>YouTube updates automatically</strong>
          <p>
            {data?.youtube.updatedAt
              ? `Last successful update: ${new Date(data.youtube.updatedAt).toLocaleString()}`
              : "Waiting for the first successful YouTube feed update. Existing videos remain visible."}
          </p>
          <p>New uploads appear under Social videos. Add selected conversations to Podcast.</p>
        </div>
        <button disabled={isFetching} onClick={() => refetch()}>
          {isFetching ? <Loader2 className="animate-spin" size={18} /> : "Check status"}
        </button>
      </div>
      {data && !data.storageAvailable && (
        <div role="status" className="gc-admin-video-warning">
          <strong>One-time database setup required</strong>
          <p>
            Apply the content_videos migration in Supabase to enable publishing. You can explore the
            library and prepare a draft now; publishing stays disabled until setup is complete.
          </p>
          <button onClick={() => refetch()}>Recheck setup</button>
        </div>
      )}
      {notice && (
        <p className="gc-admin-video-notice" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="gc-admin-video-warning">
          {error}
        </p>
      )}
      <div className="gc-admin-video-tools">
        <div role="group" aria-label="Video section">
          <button aria-pressed={placement === "podcast"} onClick={() => setPlacement("podcast")}>
            Podcast rotation
          </button>
          <button aria-pressed={placement === "social"} onClick={() => setPlacement("social")}>
            Social videos
          </button>
        </div>
        <label className="gc-admin-video-search">
          <Search size={18} />
          <input
            aria-label="Search videos"
            placeholder="Search title or platform"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="gc-admin-hidden">
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(e) => setShowHidden(e.target.checked)}
          />
          Show hidden
        </label>
      </div>
      <div className="gc-admin-video-list">
        {videos.map(({ clip, record }) => (
          <article
            key={`${clip.platform}:${clip.id}`}
            className={record?.active === false ? "is-hidden" : ""}
          >
            <div className="gc-admin-video-thumb">
              <MediaArtwork clip={clip} />
            </div>
            <div className="gc-admin-video-detail">
              <div>
                <BrandLogo brand={clip.platform} size={23} />
                <span>
                  {record?.active === false
                    ? "Hidden"
                    : record
                      ? "Curated"
                      : clip.platform === "youtube" &&
                          data?.youtube.videos.some((video) => video.id === clip.id)
                        ? "YouTube import"
                        : "On the website"}
                </span>
              </div>
              <h3>{clip.title}</h3>
              <a href={clipLink(clip)} target="_blank" rel="noopener noreferrer">
                Open original <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="gc-admin-video-actions">
              <button
                onClick={() => {
                  setEditing(draftFor(clip, record));
                  setError("");
                }}
              >
                Edit video
              </button>
              {placement === "social" && (
                <button
                  onClick={() => {
                    setEditing({
                      ...draftFor(clip),
                      placement: "podcast",
                      origin_key: `podcast:${clip.platform}:${clip.id}`,
                    });
                    setError("");
                  }}
                >
                  Add to podcast
                </button>
              )}
              <button
                disabled={busy || !data?.storageAvailable}
                onClick={() =>
                  publish({ ...draftFor(clip, record), active: record?.active === false })
                }
              >
                {record?.active === false ? <Eye size={16} /> : <EyeOff size={16} />}{" "}
                {record?.active === false ? "Show" : "Hide"}
              </button>
            </div>
          </article>
        ))}
      </div>
      {!videos.length && (
        <p className="gc-admin-video-empty">No matching videos. Paste a link to add one.</p>
      )}
      {editing && (
        <VideoEditor
          initial={editing}
          available={!!data?.storageAvailable}
          busy={busy}
          error={error}
          onClose={() => {
            if (!busy) setEditing(null);
          }}
          onSave={async (draft) => {
            if (await publish(draft)) {
              try {
                localStorage.removeItem(`gc-video-draft-v1:${draft.id || "new"}`);
              } catch {
                /* Publishing already succeeded. */
              }
              setEditing(null);
            }
          }}
        />
      )}
    </section>
  );
}
function VideoEditor({
  initial,
  available,
  busy,
  error,
  onClose,
  onSave,
}: {
  initial: Draft;
  available: boolean;
  busy: boolean;
  error: string;
  onClose: () => void;
  onSave: (draft: Draft) => Promise<void>;
}) {
  const [draft, setDraft] = useState(initial);
  const [recovery, setRecovery] = useState<Draft | null>(null);
  const [status, setStatus] = useState("Drafts stay on this device.");
  const key = `gc-video-draft-v1:${initial.id || "new"}`;
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw);
        if (
          saved &&
          typeof saved.url === "string" &&
          typeof saved.title === "string" &&
          ["podcast", "social"].includes(saved.placement)
        )
          setRecovery(saved);
      }
    } catch {
      setStatus("Device draft storage is unavailable.");
    }
  }, [key]);
  useEffect(() => {
    if (recovery) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(draft));
        setStatus("Draft saved on this device.");
      } catch {
        setStatus("Could not save draft on this device.");
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [key, draft, recovery]);
  let parsed: ReturnType<typeof parseVideoLink> | null = null;
  let linkError = "";
  try {
    if (draft.url) parsed = parseVideoLink(draft.url);
  } catch (e) {
    linkError = e instanceof Error ? e.message : "Invalid video link";
  }
  const preview = parsed ? { ...parsed, title: draft.title || "Video preview" } : null;
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="gc-dialog-overlay" />
        <Dialog.Content
          className="gc-admin-video-editor"
          onPointerDownOutside={(e) => e.preventDefault()}
          aria-describedby="video-editor-description"
        >
          <div className="gc-admin-video-heading">
            <div>
              <Dialog.Title>{initial.id ? "Edit video" : "Add a video"}</Dialog.Title>
              <Dialog.Description id="video-editor-description">
                YouTube, TikTok or Facebook. No embed code needed.
              </Dialog.Description>
            </div>
            <button aria-label="Close video editor" disabled={busy} onClick={onClose}>
              <X size={22} />
            </button>
          </div>
          <p role="status" className="gc-admin-draft-status">
            {status}
          </p>
          {recovery && (
            <div className="gc-admin-video-warning">
              A saved draft is available.{" "}
              <button
                onClick={() => {
                  const { id: _id, ...rest } = recovery;
                  setDraft({ ...rest, ...(initial.id ? { id: initial.id } : {}) });
                  setRecovery(null);
                }}
              >
                Restore draft
              </button>
              <button onClick={() => setRecovery(null)}>Keep current</button>
            </div>
          )}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!parsed || !available) return;
              await onSave(draft);
            }}
          >
            <div className="gc-admin-video-editor-grid">
              <div>
                <label>
                  Video link
                  <input
                    type="url"
                    required
                    value={draft.url}
                    placeholder="https://…"
                    onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                  />
                </label>
                {linkError && (
                  <p role="alert" className="gc-admin-link-error">
                    {linkError}
                  </p>
                )}
                <label>
                  Video title
                  <input
                    required
                    maxLength={180}
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  />
                </label>
                <label>
                  Show in
                  <select
                    value={draft.placement}
                    onChange={(e) =>
                      setDraft({ ...draft, placement: e.target.value as VideoPlacement })
                    }
                  >
                    <option value="podcast">Podcast rotation</option>
                    <option value="social">Social videos</option>
                  </select>
                </label>
                <label>
                  Position
                  <input
                    type="number"
                    min={-10000}
                    max={10000}
                    value={draft.sort_order}
                    onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                  />
                  <small>Lower numbers appear first.</small>
                </label>
                <label className="gc-admin-active">
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                  />
                  Visible on the website
                </label>
              </div>
              <aside aria-label="Video preview">
                {preview ? (
                  <>
                    <div className={`gc-admin-video-preview ${preview.platform}`}>
                      <MediaArtwork clip={preview} />
                    </div>
                    <BrandLogo brand={preview.platform} size={32} />
                    <h3>{draft.title || "Your video title"}</h3>
                    <a href={preview.url} target="_blank" rel="noopener noreferrer">
                      Check original video <ArrowUpRight size={16} />
                    </a>
                  </>
                ) : (
                  <p>Paste a video link to preview it here.</p>
                )}
              </aside>
            </div>
            {error && (
              <p role="alert" className="gc-admin-video-warning">
                {error}
              </p>
            )}
            {!available && (
              <p className="gc-admin-video-warning">
                Publishing will be available after the database setup. Your draft is saved on this
                device.
              </p>
            )}
            <div className="gc-admin-video-editor-actions">
              <button type="button" disabled={busy} onClick={onClose}>
                Close & keep draft
              </button>
              <button
                className="gc-admin-primary"
                disabled={busy || !available || !parsed || !draft.title.trim()}
              >
                {busy ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Publishing…
                  </>
                ) : (
                  "Publish video"
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
