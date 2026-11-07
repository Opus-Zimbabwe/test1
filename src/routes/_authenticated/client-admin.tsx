import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Package, ShoppingBag, Bell, LogOut, Plus, Pencil, Trash2, X,
  CheckCircle2, Download, FileText, KeyRound,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { LOGO } from "@/components/site/assets";
import { uploadFileToBucket } from "@/lib/db";
import {
  listBooksAdmin, saveBook, deleteBook, listOrdersAdmin, updateOrderStatus,
  listNotificationsAdmin, markNotificationRead, deleteNotification,
} from "@/lib/client-admin.functions";

export const Route = createFileRoute("/_authenticated/client-admin")({
  head: () => ({ meta: [{ title: "Client Admin — Great Couples" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ClientAdminPage,
});

type Tab = "books" | "orders" | "notifications" | "security";
type BookRow = Awaited<ReturnType<typeof listBooksAdmin>>[number];
type OrderRow = Awaited<ReturnType<typeof listOrdersAdmin>>[number];
type NotificationRow = Awaited<ReturnType<typeof listNotificationsAdmin>>[number];

function ClientAdminPage() {
  const [tab, setTab] = useState<Tab>("books");
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO} alt="" className="h-10 w-10 rounded-full" />
            <div>
              <p className="font-display font-black text-primary leading-none">Great Couples Admin</p>
              <p className="text-xs text-muted-foreground">Store manager</p>
            </div>
          </Link>
          <button onClick={logout} className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs"><LogOut className="h-3.5 w-3.5" /> Logout</button>
        </div>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 pb-2 flex gap-1 overflow-x-auto">
          {([
            ["books", "Books", Package],
            ["orders", "Orders", ShoppingBag],
            ["notifications", "Notifications", Bell],
            ["security", "Security", KeyRound],
          ] as [Tab, string, typeof Package][]).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${tab === id ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted"}`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>
      </header>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {tab === "books" && <BooksTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "notifications" && <NotificationsTab />}
        {tab === "security" && <SecurityTab />}
      </div>
    </main>
  );
}

function SecurityTab() {
  const [email, setEmail] = useState("");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setMsg("");
    if (next.length < 10) { setErr("New password must be at least 10 characters."); return; }
    if (next !== confirm) { setErr("New passwords do not match."); return; }
    if (next === current) { setErr("New password must be different from the current one."); return; }
    setBusy(true);
    try {
      // Re-authenticate with the current password before allowing the change.
      const { error: reauthError } = await supabase.auth.signInWithPassword({ email, password: current });
      if (reauthError) throw new Error("Current password is incorrect.");
      const { error } = await supabase.auth.updateUser({ password: next });
      if (error) throw error;
      setMsg("Password updated. Use it the next time you sign in.");
      setCurrent(""); setNext(""); setConfirm("");
    } catch (e: any) {
      setErr(e?.message ?? "Could not update password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md space-y-4">
      <div>
        <h2 className="text-xl font-black">Security</h2>
        <p className="text-sm text-muted-foreground">Change the admin password for {email || "your account"}.</p>
      </div>
      <form onSubmit={submit} className="rounded-2xl bg-card ring-1 ring-border p-6 grid gap-3">
        <label className="block">
          <span className="block text-xs font-semibold text-muted-foreground mb-1">Current password</span>
          <input type="password" autoComplete="current-password" value={current} onChange={e => setCurrent(e.target.value)} required className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold text-muted-foreground mb-1">New password (10+ characters)</span>
          <input type="password" autoComplete="new-password" value={next} onChange={e => setNext(e.target.value)} required minLength={10} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold text-muted-foreground mb-1">Confirm new password</span>
          <input type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={10} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </label>
        {err && <p className="text-xs text-accent">{err}</p>}
        {msg && <p className="text-xs text-primary font-semibold">{msg}</p>}
        <button disabled={busy} className="mt-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {busy ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}


function BooksTab() {
  const fetchBooks = useServerFn(listBooksAdmin);
  const save = useServerFn(saveBook);
  const remove = useServerFn(deleteBook);
  const [books, setBooks] = useState<BookRow[]>([]);
  const [editing, setEditing] = useState<Partial<BookRow> | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const data = await fetchBooks();
    setBooks(data);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [fetchBooks]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black">Books</h2>
        <button onClick={() => setEditing({ active: true, stock: 0, price_usd: 0 })} className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> Add book</button>
      </div>
      {loading ? <p className="text-muted-foreground">Loading…</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map(b => (
            <BookCard key={b.id} book={b} onEdit={() => setEditing(b)} onDelete={async () => { if (confirm("Delete this book?")) { await remove({ data: { id: b.id } }); refresh(); } }} />
          ))}
          {books.length === 0 && <p className="text-muted-foreground col-span-full">No books yet.</p>}
        </div>
      )}
      {editing && <BookModal initial={editing} onClose={() => setEditing(null)} onSave={async (data) => { await save({ data }); refresh(); setEditing(null); }} />}
    </div>
  );
}

function BookCard({ book, onEdit, onDelete }: { book: BookRow; onEdit: () => void; onDelete: () => void }) {
  const [coverUrl, setCoverUrl] = useState<string>(book.cover_url || "");
  useEffect(() => {
    if (book.cover_url && !/^https?:/i.test(book.cover_url)) {
      supabase.storage.from("book-covers").createSignedUrl(book.cover_url, 3600).then(({ data }) => {
        if (data?.signedUrl) setCoverUrl(data.signedUrl);
      });
    }
  }, [book.cover_url]);

  return (
    <div className="rounded-2xl bg-card ring-1 ring-border overflow-hidden">
      <div className="aspect-[4/3] bg-muted overflow-hidden">
        {coverUrl ? <img src={coverUrl} alt={book.title} className="h-full w-full object-cover" /> : <div className="h-full w-full grid place-items-center text-muted-foreground">No cover</div>}
      </div>
      <div className="p-4">
        <p className="font-bold truncate">{book.title}</p>
        <p className="text-xs text-muted-foreground">{book.author}</p>
        <p className="mt-1 text-sm">${Number(book.price_usd).toFixed(2)} {book.active ? "" : "· inactive"}</p>
        <div className="mt-3 flex gap-2">
          <button onClick={onEdit} className="flex-1 inline-flex items-center justify-center gap-1 rounded-full border px-3 py-1.5 text-xs hover:bg-muted"><Pencil className="h-3 w-3" /> Edit</button>
          <button onClick={onDelete} className="inline-flex items-center justify-center rounded-full border border-red-200 text-red-600 px-3 py-1.5 text-xs hover:bg-red-50"><Trash2 className="h-3 w-3" /></button>
        </div>
      </div>
    </div>
  );
}

function BookModal({ initial, onClose, onSave }: { initial: Partial<BookRow>; onClose: () => void; onSave: (data: any) => Promise<void> }) {
  const [f, setF] = useState<Partial<BookRow> & { cover?: string; file?: string | null; file_kind?: string | null }>({
    title: "", author: "", description: "", price_usd: 0, isbn: "", stock: 0, active: true, cover: "", file: null, file_kind: null, ...initial,
  });
  const [coverPreview, setCoverPreview] = useState<string>(initial.cover_url || "");
  const [coverUrlInput, setCoverUrlInput] = useState<string>(/^https?:/i.test(initial.cover_url || "") ? initial.cover_url! : "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState("");

  const onCoverChange = async (file: File) => {
    setErr(""); setUploading("cover");
    try {
      setCoverPreview(URL.createObjectURL(file));
      const path = await uploadFileToBucket(file, "book-covers", "covers");
      setF(prev => ({ ...prev, cover: path }));
      setCoverUrlInput("");
    } catch (e: any) {
      setErr(e?.message ?? "Cover upload failed");
    } finally { setUploading(""); }
  };

  const onCoverUrl = (v: string) => {
    setCoverUrlInput(v);
    setF(prev => ({ ...prev, cover: v }));
    setCoverPreview(v);
  };

  const onFileChange = async (file: File) => {
    setErr(""); setUploading("file");
    try {
      const kind = file.name.toLowerCase().endsWith(".epub") ? "epub" : "pdf";
      const path = await uploadFileToBucket(file, "book-files", "books");
      setF(prev => ({ ...prev, file: path, file_kind: kind }));
    } catch (e: any) {
      setErr(e?.message ?? "Book file upload failed");
    } finally { setUploading(""); }
  };


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      if (!f.id && !f.cover) throw new Error("Add a cover image (upload a file or paste a URL).");
      await onSave({
        id: f.id,
        title: f.title,
        author: f.author,
        description: f.description,
        price_usd: Number(f.price_usd) || 0,
        isbn: f.isbn || null,
        stock: Number(f.stock) || 0,
        active: !!f.active,
        cover: f.cover || null,
        file: f.file,
        file_kind: f.file_kind,
      });
    } catch (e: any) {
      setErr(e?.message ?? "Could not save this book.");
    } finally { setBusy(false); }
  };


  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <form onClick={e => e.stopPropagation()} onSubmit={submit} className="w-full max-w-lg rounded-3xl bg-background p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between"><h3 className="text-lg font-black">{initial.id ? "Edit" : "Add"} book</h3><button type="button" onClick={onClose}><X className="h-5 w-5" /></button></div>
        <div className="mt-4 grid gap-3">
          <Field label="Title" value={f.title || ""} onChange={v => setF({ ...f, title: v })} required />
          <Field label="Author" value={f.author || ""} onChange={v => setF({ ...f, author: v })} required />
    <Field label="Price (USD)" type="number" step="0.01" value={String(f.price_usd ?? 0)} onChange={v => setF({ ...f, price_usd: parseFloat(v) || 0 })} required />
          <Field label="ISBN (optional)" value={f.isbn || ""} onChange={v => setF({ ...f, isbn: v })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!f.active} onChange={e => setF({ ...f, active: e.target.checked })} /> Active (visible in store)
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1">Description</span>
            <textarea value={f.description || ""} onChange={e => setF({ ...f, description: e.target.value })} rows={3} className="w-full rounded-xl border px-3 py-2 text-sm" />
          </label>
          <div>
            <span className="block text-xs font-semibold text-muted-foreground mb-1">Cover image — upload from this device</span>
            <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && onCoverChange(e.target.files[0])} className="text-sm" />
            <span className="mt-2 block text-xs font-semibold text-muted-foreground mb-1">…or paste an image URL</span>
            <input type="url" value={coverUrlInput} onChange={e => onCoverUrl(e.target.value)} placeholder="https://example.com/cover.jpg" className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
            {coverPreview && <img src={coverPreview} alt="" className="mt-2 h-32 w-auto rounded-xl object-cover" />}
          </div>
          <div>
            <span className="block text-xs font-semibold text-muted-foreground mb-1">Book file (PDF or EPUB)</span>
            <input ref={fileInputRef} type="file" accept=".pdf,.epub,application/pdf,application/epub+zip" onChange={e => e.target.files?.[0] && onFileChange(e.target.files[0])} className="text-sm" />
            {f.file && <p className="mt-1 text-xs text-primary flex items-center gap-1"><FileText className="h-3 w-3" /> New file selected</p>}
            {initial.file_url && !f.file && <p className="mt-1 text-xs text-muted-foreground">Existing file kept ({initial.file_kind?.toUpperCase() ?? "file"})</p>}
          </div>
        </div>
        {err && <p className="mt-3 text-xs text-accent">{err}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full border px-4 py-2 text-sm">Cancel</button>
          <button disabled={busy} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Saving…" : "Save"}</button>
        </div>

      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", step, required }: { label: string; value: string; onChange: (v: string) => void; type?: string; step?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-muted-foreground mb-1">{label}{required && " *"}</span>
      <input type={type} step={step} value={value} onChange={e => onChange(e.target.value)} required={required} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
    </label>
  );
}

function OrdersTab() {
  const fetch = useServerFn(listOrdersAdmin);
  const update = useServerFn(updateOrderStatus);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => { setLoading(true); setOrders(await fetch()); setLoading(false); };
  useEffect(() => { refresh(); }, [fetch]);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="rounded-3xl bg-card ring-1 ring-border overflow-hidden">
      <div className="p-6 border-b"><h2 className="text-xl font-black">Orders</h2></div>
      {orders.length === 0 ? <p className="p-6 text-muted-foreground">No orders yet.</p> : (
        <div className="divide-y">
          {orders.map(o => (
            <div key={o.id} className="p-6 grid gap-3 sm:grid-cols-[1fr_auto] items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{o.id.slice(0, 8)}</span>
                  <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-2 font-semibold">{o.customer_name} · {o.customer_email} · {o.customer_phone}</p>
                <ul className="mt-2 text-sm text-foreground/80">
                  {((o.items as any[]) || []).map((i: any, ix: number) => <li key={ix}>• {i.qty}× {i.title} — ${(Number(i.price_usd) * i.qty).toFixed(2)}</li>)}
                </ul>
                <p className="mt-2 text-sm">Method: <b>{o.method}</b> · Total: <b className="text-accent">${Number(o.total_usd).toFixed(2)}</b> {o.paynow_reference && <>· Ref {o.paynow_reference}</>}</p>
              </div>
              <div className="flex flex-col gap-2">
                {(["pending", "paid", "fulfilled", "cancelled", "failed"] as OrderRow["status"][]).map(s => (
                  <button key={s} onClick={async () => { await update({ data: { id: o.id, status: s } }); refresh(); }} className={`rounded-full px-3 py-1 text-xs font-semibold border ${o.status === s ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}>{s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: OrderRow["status"] }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-blue-100 text-blue-800",
    fulfilled: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    failed: "bg-gray-200 text-gray-800",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[status] || map.pending}`}>{status}</span>;
}

function NotificationsTab() {
  const fetch = useServerFn(listNotificationsAdmin);
  const markRead = useServerFn(markNotificationRead);
  const remove = useServerFn(deleteNotification);
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => { setLoading(true); setItems(await fetch()); setLoading(false); };
  useEffect(() => { refresh(); }, [fetch]);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="rounded-3xl bg-card ring-1 ring-border overflow-hidden">
      <div className="p-6 border-b"><h2 className="text-xl font-black">Notifications</h2></div>
      {items.length === 0 ? <p className="p-6 text-muted-foreground">No notifications.</p> : (
        <div className="divide-y">
          {items.map(n => (
            <div key={n.id} className={`p-6 flex justify-between gap-4 ${n.read ? "opacity-70" : ""}`}>
              <div>
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!n.read && <button onClick={async () => { await markRead({ data: { id: n.id } }); refresh(); }} className="rounded-full border px-3 py-1 text-xs hover:bg-muted"><CheckCircle2 className="h-3 w-3 inline mr-1" /> Mark read</button>}
                <button onClick={async () => { await remove({ data: { id: n.id } }); refresh(); }} className="rounded-full border border-red-200 text-red-600 px-3 py-1 text-xs hover:bg-red-50"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
