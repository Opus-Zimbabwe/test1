// Simple localStorage-backed store for the admin + storefront.
// Real-time updates via a broadcast event so admin edits reflect instantly on the public site.
import soccerAsset from "@/assets/gc/announce-soccer.jpg.asset.json";
import methodistAsset from "@/assets/gc/announce-methodist.jpg.asset.json";
import seminarAsset from "@/assets/gc/announce-seminar.jpg.asset.json";


export type Book = {
  id: string;
  title: string;
  author: string;
  price: number; // USD
  cover: string;
  description: string;
  stock: number;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string; // free-form display string
  location?: string;
  image?: string; // URL or data-URL
};

export type GalleryImage = {
  id: string;
  src: string; // URL or data-URL
  caption?: string;
  createdAt: string;
};

export type Order = {
  id: string;
  createdAt: string;
  customer: { name: string; email: string; phone: string; address?: string };
  items: { bookId: string; title: string; price: number; qty: number }[];
  total: number;
  method: "visa" | "ecocash" | "onemoney" | "innbucks" | "banktransfer";
  status: "pending" | "paid" | "fulfilled" | "cancelled";
};

export type Notification = {
  id: string;
  createdAt: string;
  kind: "order" | "message";
  title: string;
  body: string;
  read: boolean;
};

const KEYS = {
  books: "gc_books",
  announcements: "gc_announcements",
  gallery: "gc_gallery",
  orders: "gc_orders",
  notifications: "gc_notifications",
  adminAuth: "gc_admin_auth",
} as const;

const EVT = "gc-store-updated";

function isBrowser() {
  return typeof window !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(EVT, { detail: { key } }));
}

export function subscribe(cb: () => void) {
  if (!isBrowser()) return () => {};
  const handler = () => cb();
  window.addEventListener(EVT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVT, handler);
    window.removeEventListener("storage", handler);
  };
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

// Default announcements (editable/deletable via admin once seeded)
function defaultAnnouncements(): Announcement[] {
  return [
    {
      id: uid(),
      date: "25 July · 10:00",
      title: "Charity Soccer Match",
      body: "Great Couples Select vs Harare Central Prison Select. Come out and cheer on restoration through sport.",
      location: "Harare Central Prison",
      image: soccerAsset.url,
    },
    {
      id: uid(),
      date: "31 July",
      title: "Methodist Harare West Women's Conference",
      body: "Founder Pastor Jethro Mukome speaks on marriage, family and Kingdom womanhood.",
      location: "Glen City",
      image: methodistAsset.url,
    },
    {
      id: uid(),
      date: "22 August · 10:00 – 16:00",
      title: "Great Couples Seminar — Cape Town",
      body: "Bring Back Godly Marriages. Guest: Pastor J&M Mukome. Host: Pastor Joseph. Lunch will be served, in partnership with Globus Culinaire.",
      location: "15 Lalo Street, Delft South, Cape Town",
      image: seminarAsset.url,
    },
  ];
}

// Seed defaults if empty
function seed() {
  if (!isBrowser()) return;
  if (!window.localStorage.getItem(KEYS.books)) {
    const seeded: Book[] = [
      {
        id: uid(),
        title: "Foundations of a Great Marriage",
        author: "Pastor Jethro Mukome",
        price: 15,
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
        description: "Biblical principles for building a marriage that lasts a lifetime.",
        stock: 100,
      },
      {
        id: uid(),
        title: "Before You Say I Do",
        author: "Great Couples Trust",
        price: 12,
        cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
        description: "A pre-marital counselling companion for engaged couples.",
        stock: 80,
      },
    ];
    write(KEYS.books, seeded);
  }
  if (!window.localStorage.getItem(KEYS.announcements)) write<Announcement[]>(KEYS.announcements, defaultAnnouncements());
  if (!window.localStorage.getItem(KEYS.gallery)) write<GalleryImage[]>(KEYS.gallery, []);
  if (!window.localStorage.getItem(KEYS.orders)) write<Order[]>(KEYS.orders, []);
  if (!window.localStorage.getItem(KEYS.notifications)) write<Notification[]>(KEYS.notifications, []);
}

// Books
export const booksApi = {
  list: (): Book[] => { seed(); return read<Book[]>(KEYS.books, []); },
  save: (b: Omit<Book, "id"> & { id?: string }): Book => {
    const all = booksApi.list();
    if (b.id) {
      const next = all.map(x => x.id === b.id ? { ...x, ...b } as Book : x);
      write(KEYS.books, next);
      return next.find(x => x.id === b.id)!;
    }
    const created: Book = { ...b, id: uid() };
    write(KEYS.books, [created, ...all]);
    return created;
  },
  remove: (id: string) => write(KEYS.books, booksApi.list().filter(b => b.id !== id)),
};

// Announcements
export const announcementsApi = {
  list: (): Announcement[] => { seed(); return read<Announcement[]>(KEYS.announcements, []); },
  save: (a: Omit<Announcement, "id"> & { id?: string }): Announcement => {
    const all = announcementsApi.list();
    if (a.id) {
      const next = all.map(x => x.id === a.id ? { ...x, ...a } as Announcement : x);
      write(KEYS.announcements, next);
      return next.find(x => x.id === a.id)!;
    }
    const created: Announcement = { ...a, id: uid() };
    write(KEYS.announcements, [created, ...all]);
    return created;
  },
  remove: (id: string) => write(KEYS.announcements, announcementsApi.list().filter(a => a.id !== id)),
  reset: () => write(KEYS.announcements, defaultAnnouncements()),
};

// Gallery (admin-managed custom images shown on top of the default gallery)
export const galleryApi = {
  list: (): GalleryImage[] => { seed(); return read<GalleryImage[]>(KEYS.gallery, []); },
  add: (src: string, caption?: string): GalleryImage => {
    const created: GalleryImage = { id: uid(), src, caption, createdAt: new Date().toISOString() };
    write(KEYS.gallery, [created, ...galleryApi.list()]);
    return created;
  },
  update: (id: string, patch: Partial<Omit<GalleryImage, "id" | "createdAt">>) => {
    write(KEYS.gallery, galleryApi.list().map(g => g.id === id ? { ...g, ...patch } : g));
  },
  remove: (id: string) => write(KEYS.gallery, galleryApi.list().filter(g => g.id !== id)),
};

// Orders
export const ordersApi = {
  list: (): Order[] => { seed(); return read<Order[]>(KEYS.orders, []); },
  create: (o: Omit<Order, "id" | "createdAt" | "status">): Order => {
    const created: Order = { ...o, id: uid(), createdAt: new Date().toISOString(), status: "pending" };
    write(KEYS.orders, [created, ...ordersApi.list()]);
    notificationsApi.push({
      kind: "order",
      title: `New order · $${created.total.toFixed(2)}`,
      body: `${created.customer.name} · ${created.items.length} item(s) · ${created.method}`,
    });
    return created;
  },
  updateStatus: (id: string, status: Order["status"]) => {
    write(KEYS.orders, ordersApi.list().map(o => o.id === id ? { ...o, status } : o));
  },
};

// Notifications
export const notificationsApi = {
  list: (): Notification[] => { seed(); return read<Notification[]>(KEYS.notifications, []); },
  push: (n: Omit<Notification, "id" | "createdAt" | "read">) => {
    const created: Notification = { ...n, id: uid(), createdAt: new Date().toISOString(), read: false };
    write(KEYS.notifications, [created, ...notificationsApi.list()]);
  },
  markAllRead: () => write(KEYS.notifications, notificationsApi.list().map(n => ({ ...n, read: true }))),
  clear: () => write(KEYS.notifications, []),
};

// Simple client-side admin auth (placeholder — replace with real auth when Cloud is enabled).
const ADMIN_PASSCODE = "greatcouples2026";
export const adminAuth = {
  isAuthed: () => isBrowser() && window.sessionStorage.getItem(KEYS.adminAuth) === "1",
  login: (code: string) => {
    if (code === ADMIN_PASSCODE) {
      window.sessionStorage.setItem(KEYS.adminAuth, "1");
      return true;
    }
    return false;
  },
  logout: () => window.sessionStorage.removeItem(KEYS.adminAuth),
};

export const PAYMENT_METHODS: { id: Order["method"]; label: string; note: string }[] = [
  { id: "visa", label: "Visa", note: "Card payment via Paynow (placeholder)" },
  { id: "ecocash", label: "EcoCash", note: "Mobile money via Paynow (placeholder)" },
  { id: "onemoney", label: "OneMoney", note: "Mobile money via Paynow (placeholder)" },
  { id: "innbucks", label: "InnBucks", note: "Wallet via Paynow (placeholder)" },
  { id: "banktransfer", label: "Bank Transfer", note: "Bank transfer via Paynow (placeholder)" },
];
