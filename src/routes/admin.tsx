import { createFileRoute, Link } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Image as ImageIcon,
  Images,
  LayoutDashboard,
  Loader2,
  LogOut,
  Megaphone,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { LOGO } from "@/components/site/assets";
import { ImagePicker } from "@/components/site/ImagePicker";
import {
  useAnnouncements,
  useGalleryImages,
  useSignedImageUrl,
  uploadImageToBucket,
  type Announcement,
  type GalleryImage,
} from "@/lib/db";
import {
  verifySiteAdminPasscode,
  saveGalleryImage,
  deleteGalleryImage,
  saveAnnouncement,
  deleteAnnouncement,
} from "@/lib/site-admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Content Admin — Great Couples" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Tab = "announcements" | "gallery";
type GalleryRow = GalleryImage;
type AnnouncementRow = Announcement;

const AUTH_KEY = "gc_site_admin";

function AdminPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(typeof window !== "undefined" && !!sessionStorage.getItem(AUTH_KEY));
  }, []);

  if (!authed) return <LoginGate onOk={() => setAuthed(true)} />;
  return (
    <Dashboard
      onLogout={() => {
        sessionStorage.removeItem(AUTH_KEY);
        setAuthed(false);
      }}
    />
  );
}

function LoginGate({ onOk }: { onOk: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const verify = useServerFn(verifySiteAdminPasscode);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await verify({ data: { passcode: code } });
      sessionStorage.setItem(AUTH_KEY, code);
      onOk();
    } catch {
      setErr("That passcode was not accepted. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-muted px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl bg-card p-7 shadow-[0_24px_56px_-30px_rgba(42,18,70,.5)] sm:p-9"
      >
        <Link
          to="/"
          className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/8"
        >
          <img src={LOGO} alt="Great Couples" className="h-11 w-11 rounded-full" />
        </Link>
        <p className="mt-6 text-center text-[.6rem] font-bold uppercase tracking-[.16em] text-accent">
          Great Couples
        </p>
        <h1 className="mt-2 text-center text-3xl font-bold">Content Admin</h1>
        <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-6 text-muted-foreground">
          Manage announcements and gallery images from one workspace.
        </p>
        <label className="mt-7 block">
          <span className="mb-1.5 block text-[.62rem] font-bold uppercase tracking-[.12em] text-muted-foreground">
            Site passcode
          </span>
          <input
            type="password"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            autoComplete="current-password"
            placeholder="Enter passcode"
            className="w-full rounded-xl border border-primary/10 bg-muted/55 px-4 py-3 text-sm outline-none transition focus:border-primary/35 focus:bg-white focus:ring-4 focus:ring-primary/8"
          />
        </label>
        {err && (
          <p
            role="alert"
            className="mt-3 rounded-xl bg-accent/8 px-3 py-2.5 text-xs font-medium text-accent"
          >
            {err}
          </p>
        )}
        <button
          disabled={busy}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}{" "}
          {busy ? "Signing in…" : "Open content admin"}
        </button>
      </form>
    </main>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("announcements");
  const { rows: announcements } = useAnnouncements();
  const { rows: gallery } = useGalleryImages();

  return (
    <main className="min-h-screen bg-muted">
      <header className="sticky top-0 z-30 border-b border-primary/8 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img
              src={LOGO}
              alt="Great Couples"
              className="h-10 w-10 shrink-0 rounded-full ring-1 ring-primary/12"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-none text-primary">
                Great Couples
              </p>
              <p className="mt-1 text-[.58rem] font-bold uppercase tracking-[.14em] text-muted-foreground">
                Content Admin
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden rounded-full border border-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-muted sm:inline-flex"
            >
              View site
            </Link>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        <section className="relative overflow-hidden rounded-2xl bg-primary px-6 py-8 text-white shadow-[0_22px_46px_-28px_rgba(42,18,70,.58)] sm:px-8 sm:py-9">
          <span
            aria-hidden
            className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-accent/60"
          />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-[.6rem] font-bold uppercase tracking-[.14em] text-white/85">
                <LayoutDashboard className="h-3 w-3" /> Content workspace
              </p>
              <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                Keep the website fresh.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                Publish news and curate the moments that appear on the Great Couples website.
              </p>
            </div>
            <div className="flex gap-3">
              <AdminStat icon={Megaphone} label="Announcements" value={announcements.length} />
              <AdminStat icon={Images} label="Gallery images" value={gallery.length} />
            </div>
          </div>
        </section>

        <nav
          aria-label="Content sections"
          className="mt-6 flex w-full gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm"
        >
          {(
            [
              ["announcements", "Announcements", Megaphone, announcements.length],
              ["gallery", "Gallery", ImageIcon, gallery.length],
            ] as [Tab, string, typeof Megaphone, number][]
          ).map(([id, label, Icon, count]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition ${tab === id ? "bg-primary text-primary-foreground shadow-md shadow-primary/15" : "text-muted-foreground hover:bg-muted hover:text-primary"}`}
            >
              <Icon className="h-4 w-4" /> {label}{" "}
              <span
                className={`grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[.58rem] ${tab === id ? "bg-white/16 text-white" : "bg-primary/8 text-primary"}`}
              >
                {count}
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-6">
          {tab === "announcements" && <AnnouncementsTab />}
          {tab === "gallery" && <GalleryTab />}
        </div>
      </div>
    </main>
  );
}

function AdminStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Megaphone;
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-[5.5rem] rounded-xl border border-white/14 bg-white/8 px-3 py-2.5 text-center">
      <Icon className="mx-auto h-3.5 w-3.5 text-white/70" />
      <p className="mt-1 text-lg font-semibold leading-none text-white">{value}</p>
      <p className="mt-1 text-[.52rem] font-bold uppercase tracking-[.1em] text-white/58">
        {label}
      </p>
    </div>
  );
}

function usePasscode() {
  return typeof window !== "undefined" ? sessionStorage.getItem(AUTH_KEY) || "" : "";
}

function useUploader(_passcode: string, bucket: "gallery" | "announcements") {
  return async (file: File) => uploadImageToBucket(file, bucket, bucket);
}

function Thumb({
  src,
  bucket,
  className,
}: {
  src: string | null;
  bucket: string;
  className?: string;
}) {
  const url = useSignedImageUrl(src, bucket);
  return url ? (
    <img src={url} alt="" className={className} />
  ) : (
    <div className={`${className} bg-muted`} />
  );
}

function AnnouncementsTab() {
  const save = useServerFn(saveAnnouncement);
  const remove = useServerFn(deleteAnnouncement);
  const { rows: items, loading, refresh } = useAnnouncements();
  const [editing, setEditing] = useState<Partial<AnnouncementRow> | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const passcode = usePasscode();
  const uploader = useUploader(passcode, "announcements");

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this announcement? This cannot be undone.")) return;
    setError("");
    try {
      await remove({ data: { passcode, id } });
      refresh();
      setNotice("Announcement deleted.");
    } catch (deleteError: unknown) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Delete failed. Please try again.",
      );
    }
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_14px_32px_-25px_rgba(42,18,70,.35)] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[.6rem] font-bold uppercase tracking-[.14em] text-accent">
            Website updates
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Announcements</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit and order the updates shown to visitors.
          </p>
        </div>
        <button
          onClick={() => {
            setNotice("");
            setError("");
            setEditing({});
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-xs font-bold text-accent-foreground shadow-md shadow-accent/18 transition hover:-translate-y-0.5 hover:brightness-105"
        >
          <Plus className="h-3.5 w-3.5" /> New announcement
        </button>
      </div>

      {(notice || error) && <Feedback notice={notice} error={error} />}
      {loading ? (
        <LoadingState label="Loading announcements…" />
      ) : (
        <div className="mt-6 grid gap-3">
          {items.length === 0 && (
            <EmptyState
              icon={Megaphone}
              title="No announcements yet"
              detail="Create your first update to share it with visitors."
            />
          )}
          {items.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col gap-4 rounded-2xl border border-primary/8 bg-card p-4 transition hover:border-primary/18 sm:flex-row sm:items-center"
            >
              {item.image_url ? (
                <Thumb
                  src={item.image_url}
                  bucket="announcements"
                  className="h-20 w-full rounded-xl object-cover sm:w-24 sm:shrink-0"
                />
              ) : (
                <span className="grid h-20 w-full place-items-center rounded-xl bg-muted text-primary/45 sm:w-24 sm:shrink-0">
                  <CalendarDays className="h-6 w-6" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[.6rem] font-bold uppercase tracking-[.12em] text-accent">
                  {item.date_text}
                  {item.location && ` · ${item.location}`}
                </p>
                <h3 className="mt-1 truncate text-base font-semibold">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {item.body}
                </p>
              </div>
              <div className="flex shrink-0 gap-2 sm:opacity-70 sm:transition sm:group-hover:opacity-100">
                <button
                  onClick={() => {
                    setNotice("");
                    setError("");
                    setEditing(item);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const { id: _id, created_at: _created, ...draft } = item;
                    setEditing({ ...draft, title: `${item.title} (copy)` });
                  }}
                  className="rounded-full border border-primary/10 px-3 py-2 text-xs font-bold"
                >
                  Reuse
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  aria-label={`Delete ${item.title}`}
                  className="grid h-8 w-8 place-items-center rounded-full border border-accent/20 text-accent transition hover:bg-accent hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {editing && (
        <AnnouncementModal
          initial={editing}
          onUpload={uploader}
          onClose={() => setEditing(null)}
          onSave={async (data) => {
            await save({ data: { ...data, passcode } });
            refresh();
            setNotice(editing.id ? "Announcement updated." : "Announcement published.");
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}

function GalleryTab() {
  const save = useServerFn(saveGalleryImage);
  const remove = useServerFn(deleteGalleryImage);
  const { rows: items, loading, refresh } = useGalleryImages();
  const [editing, setEditing] = useState<Partial<GalleryRow> | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const passcode = usePasscode();
  const uploader = useUploader(passcode, "gallery");

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    setError("");
    try {
      await remove({ data: { passcode, id } });
      refresh();
      setNotice("Gallery image deleted.");
    } catch (deleteError: unknown) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Delete failed. Please try again.",
      );
    }
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_14px_32px_-25px_rgba(42,18,70,.35)] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[.6rem] font-bold uppercase tracking-[.14em] text-accent">
            Visual library
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Gallery</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload from this device or paste an image URL. Changes update live.
          </p>
        </div>
        <button
          onClick={() => {
            setNotice("");
            setError("");
            setEditing({});
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-xs font-bold text-accent-foreground shadow-md shadow-accent/18 transition hover:-translate-y-0.5 hover:brightness-105"
        >
          <Plus className="h-3.5 w-3.5" /> Add image
        </button>
      </div>

      {(notice || error) && <Feedback notice={notice} error={error} />}
      {loading ? (
        <LoadingState label="Loading gallery…" />
      ) : items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Images}
            title="No gallery images yet"
            detail="Add images to share outreach and event moments."
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-primary/8 bg-card shadow-sm"
            >
              <div className="relative aspect-square bg-muted">
                <Thumb
                  src={item.src}
                  bucket="gallery"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/75 to-transparent p-3 pt-10">
                  <p className="truncate text-xs font-medium text-white">
                    {item.caption || "Untitled image"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 p-2.5">
                <span className="text-[.58rem] font-bold uppercase tracking-[.1em] text-muted-foreground">
                  Order {item.sort_order}
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setNotice("");
                      setError("");
                      setEditing(item);
                    }}
                    aria-label={`Edit ${item.caption || "gallery image"}`}
                    className="grid h-8 w-8 place-items-center rounded-full bg-primary/7 text-primary transition hover:bg-primary hover:text-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    aria-label={`Delete ${item.caption || "gallery image"}`}
                    className="grid h-8 w-8 place-items-center rounded-full bg-accent/8 text-accent transition hover:bg-accent hover:text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {editing && (
        <GalleryModal
          initial={editing}
          onUpload={uploader}
          onClose={() => setEditing(null)}
          onSave={async (data) => {
            await save({ data: { ...data, passcode } });
            refresh();
            setNotice(editing.id ? "Gallery image updated." : "Gallery image added.");
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}

function Feedback({ notice, error }: { notice: string; error: string }) {
  if (error)
    return (
      <p
        role="alert"
        className="mt-5 flex items-center gap-2 rounded-xl bg-accent/8 px-3.5 py-3 text-xs font-medium text-accent"
      >
        <AlertCircle className="h-4 w-4 shrink-0" /> {error}
      </p>
    );
  return (
    <p className="mt-5 flex items-center gap-2 rounded-xl bg-primary/7 px-3.5 py-3 text-xs font-medium text-primary">
      <CheckCircle2 className="h-4 w-4 shrink-0" /> {notice}
    </p>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="mt-6 flex items-center gap-2 rounded-xl bg-muted px-4 py-8 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-primary" /> {label}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof Megaphone;
  title: string;
  detail: string;
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-primary/15 bg-muted/50 px-5 py-12 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-primary shadow-sm">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-sm font-semibold text-primary">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[.62rem] font-bold uppercase tracking-[.1em] text-muted-foreground">
        {label}
        {required && " *"}
      </span>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-xl border border-primary/10 bg-muted/55 px-3 py-2.5 text-sm outline-none transition focus:border-primary/35 focus:bg-white focus:ring-4 focus:ring-primary/8"
      />
    </label>
  );
}

function AnnouncementModal({
  initial,
  onClose,
  onSave,
  onUpload,
}: {
  initial: Partial<AnnouncementRow>;
  onClose: () => void;
  onSave: (data: Partial<AnnouncementRow>) => Promise<void>;
  onUpload: (file: File) => Promise<string>;
}) {
  const [form, setForm] = useState<Partial<AnnouncementRow>>({
    title: "",
    body: "",
    date_text: "",
    location: "",
    image_url: "",
    sort_order: 0,
    ...initial,
  });
  const draftKey = `gc-announcement-draft-v1:${initial.id || "new"}`;
  const [savedDraft, setSavedDraft] = useState<Partial<AnnouncementRow> | null>(null);
  const [draftStatus, setDraftStatus] = useState("Drafts stay on this device.");
  const [mobilePreview, setMobilePreview] = useState(false);
  const preview = useSignedImageUrl(form.image_url || "", "announcements");
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft && typeof draft === "object" && typeof draft.title === "string")
          setSavedDraft(draft);
      }
    } catch {
      setDraftStatus("Draft storage is unavailable on this device.");
    }
  }, [draftKey]);
  useEffect(() => {
    if (savedDraft) return;
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(form));
        setDraftStatus("Draft saved on this device.");
      } catch {
        setDraftStatus("Could not save draft. Keep this window open.");
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [form, draftKey, savedDraft]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (!form.title?.trim() || !form.date_text?.trim())
        throw new Error("Add a title and date before publishing.");
      await onSave({ ...form, title: form.title.trim(), date_text: form.date_text.trim() });
      try {
        localStorage.removeItem(draftKey);
      } catch {
        /* Publishing succeeded even if device storage is unavailable. */
      }
    } catch (saveError: unknown) {
      setError(
        saveError instanceof Error ? saveError.message : "Could not save this announcement.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal/65 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby="composer-help"
          onEscapeKeyDown={(event) => {
            if (busy) event.preventDefault();
          }}
          onPointerDownOutside={(event) => event.preventDefault()}
          className="fixed inset-3 z-50 overflow-y-auto rounded-3xl bg-background p-5 sm:inset-8 sm:p-8"
        >
          <form onSubmit={submit} className="mx-auto max-w-6xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[.6rem] font-bold uppercase tracking-[.14em] text-accent">
                  Announcement
                </p>
                <Dialog.Title className="mt-1 text-3xl font-extrabold">
                  {initial.id ? "Edit announcement" : "New announcement"}
                </Dialog.Title>
                <Dialog.Description
                  id="composer-help"
                  className="mt-2 text-sm text-muted-foreground"
                >
                  Compose, preview and publish to your website.
                </Dialog.Description>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full bg-muted text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p role="status" className="mt-5 text-sm text-muted-foreground">
              {draftStatus}
            </p>
            {savedDraft && (
              <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-primary/20 p-4">
                <p>A previous draft is available.</p>
                <button
                  type="button"
                  className="font-bold text-primary"
                  onClick={() => {
                    setForm({ ...savedDraft, ...(initial.id ? { id: initial.id } : {}) });
                    setSavedDraft(null);
                  }}
                >
                  Restore draft
                </button>
                <button type="button" onClick={() => setSavedDraft(null)}>
                  Keep current version
                </button>
              </div>
            )}
            <div className="mt-6 grid gap-8 lg:grid-cols-2">
              <div>
                <label className="mb-5 block text-sm font-bold">
                  Start with a format
                  <select
                    aria-label="Announcement format"
                    defaultValue=""
                    className="mt-2 w-full rounded-xl border p-3"
                    onChange={(event) => {
                      const kind = event.target.value;
                      if (!kind) return;
                      if (
                        (form.title || form.body) &&
                        !confirm(
                          "Replace the title and body with this format? Your other fields will be kept.",
                        )
                      )
                        return;
                      setForm({
                        ...form,
                        title:
                          kind === "event"
                            ? "Marriage seminar"
                            : kind === "outreach"
                              ? "Community outreach"
                              : "An update from Great Couples",
                        body:
                          kind === "event"
                            ? "Join us for a conversation that strengthens marriage and family.\n\nWhat to expect:\n\nHow to attend:"
                            : kind === "outreach"
                              ? "Together, we are supporting families in our community.\n\nWhere we are going:\n\nHow to take part:"
                              : "Share your news with the Great Couples community.",
                      });
                    }}
                  >
                    <option value="">Choose a format</option>
                    <option value="event">Seminar or gathering</option>
                    <option value="outreach">Community outreach</option>
                    <option value="news">Community update</option>
                  </select>
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Title"
                    value={form.title || ""}
                    onChange={(value) => setForm({ ...form, title: value })}
                    required
                  />
                  <FormField
                    label="Date text"
                    value={form.date_text || ""}
                    onChange={(value) => setForm({ ...form, date_text: value })}
                    required
                  />
                  <FormField
                    label="Location"
                    value={form.location || ""}
                    onChange={(value) => setForm({ ...form, location: value })}
                  />
                  <FormField
                    label="Sort order"
                    type="number"
                    value={String(form.sort_order ?? 0)}
                    onChange={(value) => setForm({ ...form, sort_order: Number(value) })}
                  />
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[.62rem] font-bold uppercase tracking-[.1em] text-muted-foreground">
                      Body
                    </span>
                    <textarea
                      value={form.body || ""}
                      onChange={(event) => setForm({ ...form, body: event.target.value })}
                      rows={5}
                      className="w-full resize-y rounded-xl border border-primary/10 bg-muted/55 px-3 py-2.5 text-sm outline-none transition focus:border-primary/35 focus:bg-white focus:ring-4 focus:ring-primary/8"
                    />
                  </label>
                  <div className="sm:col-span-2">
                    <ImagePicker
                      label="Announcement image"
                      bucket="announcements"
                      value={form.image_url || ""}
                      onChange={(value) => setForm({ ...form, image_url: value })}
                      onUpload={onUpload}
                    />
                  </div>
                </div>
              </div>
              <aside
                className="rounded-2xl bg-primary/5 p-5 lg:sticky lg:top-0 lg:self-start"
                aria-label="Announcement preview"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h4 className="text-lg font-extrabold">Website preview</h4>
                  <button
                    type="button"
                    aria-pressed={mobilePreview}
                    className="rounded-full border px-3 py-2 text-sm"
                    onClick={() => setMobilePreview(!mobilePreview)}
                  >
                    {mobilePreview ? "Show wide preview" : "Show mobile preview"}
                  </button>
                </div>
                <article
                  className={`mx-auto overflow-hidden rounded-2xl bg-white p-5 ${mobilePreview ? "max-w-[320px]" : "w-full"}`}
                >
                  {preview && (
                    <img
                      src={preview}
                      alt="Announcement artwork preview"
                      className="mb-5 max-h-96 w-full object-contain"
                    />
                  )}
                  <p className="text-sm font-bold text-accent">
                    {form.date_text || "Event date"}
                    {form.location && ` · ${form.location}`}
                  </p>
                  <h4 className="mt-3 break-words text-3xl font-extrabold">
                    {form.title || "Your announcement title"}
                  </h4>
                  <p className="mt-4 whitespace-pre-wrap break-words text-base leading-7 text-muted-foreground">
                    {form.body || "Your announcement will appear here as you write."}
                  </p>
                </article>
                <p className="mt-4 text-sm text-muted-foreground">
                  Publishing updates the website. It does not post to social media.
                </p>
              </aside>
            </div>
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-accent/8 px-3.5 py-3 text-xs font-medium text-accent"
              >
                {error}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="rounded-full border border-primary/10 px-4 py-2.5 text-xs font-bold text-primary"
              >
                Cancel
              </button>
              <button
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground disabled:opacity-60"
              >
                {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {busy ? "Publishing…" : "Publish to website"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function GalleryModal({
  initial,
  onClose,
  onSave,
  onUpload,
}: {
  initial: Partial<GalleryRow>;
  onClose: () => void;
  onSave: (data: Partial<GalleryRow>) => Promise<void>;
  onUpload: (file: File) => Promise<string>;
}) {
  const [form, setForm] = useState<Partial<GalleryRow>>({
    src: "",
    caption: "",
    sort_order: 0,
    ...initial,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSave(form);
    } catch (saveError: unknown) {
      setError(
        saveError instanceof Error ? saveError.message : "Could not save this gallery image.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-charcoal/55 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <form
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
        className="my-8 w-full max-w-xl rounded-2xl bg-background p-5 shadow-2xl sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-label={initial.id ? "Edit gallery image" : "Add gallery image"}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[.6rem] font-bold uppercase tracking-[.14em] text-accent">
              Visual library
            </p>
            <h3 className="mt-1 text-2xl font-semibold">
              {initial.id ? "Edit image" : "Add image"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full bg-muted text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          <ImagePicker
            label="Photo"
            bucket="gallery"
            value={form.src || ""}
            onChange={(value) => setForm({ ...form, src: value })}
            onUpload={onUpload}
          />
          <FormField
            label="Caption"
            value={form.caption || ""}
            onChange={(value) => setForm({ ...form, caption: value })}
          />
          <FormField
            label="Sort order"
            type="number"
            value={String(form.sort_order ?? 0)}
            onChange={(value) => setForm({ ...form, sort_order: Number(value) })}
          />
        </div>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-accent/8 px-3.5 py-3 text-xs font-medium text-accent"
          >
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-primary/10 px-4 py-2.5 text-xs font-bold text-primary"
          >
            Cancel
          </button>
          <button
            disabled={!form.src || busy}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground disabled:opacity-60"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {busy ? "Saving…" : "Save image"}
          </button>
        </div>
      </form>
    </div>
  );
}
