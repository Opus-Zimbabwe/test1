import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Download,
  Check,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useBooks, type Book } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { LOGO } from "@/components/site/assets";
import { PAYMENT_METHODS, MethodLogo, type PaymentMethodId } from "@/components/site/PaymentLogos";
import { startCheckout } from "@/lib/paynow.functions";
import { getBookDownloadUrl } from "@/lib/downloads.functions";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [{ title: "Store — Great Couples" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: StorePage,
});

type CartItem = { bookId: string; qty: number };
type CheckoutResult =
  | { order_id: string; kind: "web"; redirect_url: string; receipt_url: string }
  | { order_id: string; kind: "mobile"; instructions: string; receipt_url: string };

function useCoverUrl(coverUrl: string | null) {
  const [url, setUrl] = useState<string>(coverUrl || "");

  useEffect(() => {
    if (!coverUrl) {
      setUrl("");
      return;
    }
    if (/^https?:/i.test(coverUrl)) {
      setUrl(coverUrl);
      return;
    }
    supabase.storage
      .from("book-covers")
      .createSignedUrl(coverUrl, 3600)
      .then(({ data, error }) => {
        if (data?.signedUrl) setUrl(data.signedUrl);
        else {
          console.error("cover signed url", error);
          setUrl("");
        }
      });
  }, [coverUrl]);

  return url;
}

function StorePage() {
  const { rows: dbBooks } = useBooks();
  const books = dbBooks.filter((book) => book.active);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);

  const addToCart = (bookId: string) => {
    setCart((current) => {
      const existing = current.find((item) => item.bookId === bookId);
      return existing
        ? current.map((item) => (item.bookId === bookId ? { ...item, qty: item.qty + 1 } : item))
        : [...current, { bookId, qty: 1 }];
    });
    setCartOpen(true);
  };

  const setQty = (bookId: string, qty: number) =>
    setCart((current) =>
      qty <= 0
        ? current.filter((item) => item.bookId !== bookId)
        : current.map((item) => (item.bookId === bookId ? { ...item, qty } : item)),
    );

  const items = cart
    .map((cartItem) => ({ ...cartItem, book: books.find((book) => book.id === cartItem.bookId)! }))
    .filter((item) => item.book);
  const total = items.reduce((sum, item) => sum + Number(item.book.price_usd) * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (result) {
    return (
      <main className="min-h-screen bg-muted">
        <StoreHeader cartCount={0} onOpenCart={() => {}} />
        <div className="mx-auto max-w-xl px-4 py-24 sm:px-6">
          <div className="rounded-2xl bg-card p-8 text-center shadow-[0_22px_48px_-28px_rgba(42,18,70,.48)] sm:p-10">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/9 text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <p className="mt-6 text-[.62rem] font-bold uppercase tracking-[.16em] text-accent">
              Secure checkout
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              {result.kind === "web" ? "Redirecting to Paynow" : "Payment instructions sent"}
            </h1>
            {result.kind === "web" ? (
              <>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Complete your payment on Paynow&apos;s secure checkout.
                </p>
                <a
                  href={result.redirect_url}
                  className="mt-7 inline-flex rounded-full bg-accent px-6 py-3 text-xs font-bold text-accent-foreground shadow-lg shadow-accent/20 transition hover:-translate-y-0.5"
                >
                  Continue to Paynow
                </a>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {result.instructions}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  After paying, your receipt will be updated automatically.
                </p>
              </>
            )}
            <a
              href={result.receipt_url}
              className="mt-5 block text-xs font-semibold text-primary hover:underline"
            >
              View receipt · Order {result.order_id.slice(0, 8)}
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <StoreHeader cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />

      <section className="overflow-hidden bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-[3.75rem] sm:px-6 sm:py-20">
          <div className="relative rounded-2xl bg-primary px-6 py-10 text-primary-foreground shadow-[0_22px_46px_-29px_rgba(42,18,70,.58)] sm:px-10 sm:py-12">
            <span
              aria-hidden
              className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/55"
            />
            <span
              aria-hidden
              className="absolute -bottom-24 left-[45%] h-40 w-40 rounded-full bg-white/6"
            />
            <div className="relative max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-[.6rem] font-bold uppercase tracking-[.14em] text-white/85">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Great Couples Store
              </p>
              <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl">
                Books &amp; Resources
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
                Support the ministry and grow your marriage with our curated collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-[4.5rem] sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Browse the collection</p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Resources for stronger relationships.
            </h2>
          </div>
          {cartCount > 0 && (
            <button
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-white px-4 py-2.5 text-xs font-bold text-primary shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <ShoppingCart className="h-4 w-4" /> {cartCount} item{cartCount === 1 ? "" : "s"} in
              cart
            </button>
          )}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onAdd={() => addToCart(book.id)} />
          ))}
          {books.length === 0 && (
            <div className="col-span-full rounded-2xl bg-muted px-6 py-12 text-center text-sm text-muted-foreground">
              No books available yet.
            </div>
          )}
        </div>
      </section>

      {cartOpen && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-charcoal/55 p-3 backdrop-blur-[2px] sm:p-6"
          onClick={() => setCartOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={checkout ? "Secure checkout" : "Shopping cart"}
            className={`flex max-h-[calc(100svh-1.5rem)] w-full flex-col overflow-hidden rounded-2xl bg-background shadow-[0_28px_70px_-28px_rgba(15,8,24,.7)] sm:max-h-[calc(100svh-3rem)] ${checkout ? "max-w-5xl" : "max-w-2xl"}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-primary/8 bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-[.6rem] font-bold uppercase tracking-[.15em] text-accent">
                  {checkout ? "Secure checkout" : "Your selection"}
                </p>
                <h2 className="mt-0.5 text-xl font-semibold">
                  {checkout ? "Complete your order" : "Your Cart"}
                </h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full bg-muted text-primary transition hover:bg-primary hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {checkout ? (
                <CheckoutForm
                  items={items}
                  total={total}
                  onBack={() => setCheckout(false)}
                  onResult={(checkoutResult) => {
                    setResult(checkoutResult);
                    setCartOpen(false);
                    setCheckout(false);
                  }}
                />
              ) : (
                <CartPanel
                  items={items}
                  total={total}
                  setQty={setQty}
                  onCheckout={() => setCheckout(true)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function CartPanel({
  items,
  total,
  setQty,
  onCheckout,
}: {
  items: { bookId: string; qty: number; book: Book }[];
  total: number;
  setQty: (bookId: string, qty: number) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="space-y-4 p-5 sm:p-6">
      {items.length === 0 && (
        <div className="rounded-2xl bg-muted px-5 py-10 text-center text-sm text-muted-foreground">
          Your cart is empty.
        </div>
      )}
      {items.map((item) => (
        <div
          key={item.bookId}
          className="flex gap-3 rounded-2xl border border-primary/8 bg-white p-3"
        >
          <CoverThumb
            src={item.book.cover_url}
            className="h-20 w-16 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-primary">{item.book.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              ${Number(item.book.price_usd).toFixed(2)}
            </p>
            <div className="mt-3 inline-flex items-center rounded-full border border-primary/10 bg-muted/55 p-0.5">
              <button
                onClick={() => setQty(item.bookId, item.qty - 1)}
                aria-label={`Remove one ${item.book.title}`}
                className="grid h-6 w-6 place-items-center rounded-full text-primary transition hover:bg-white"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="min-w-7 text-center text-xs font-bold text-primary">{item.qty}</span>
              <button
                onClick={() => setQty(item.bookId, item.qty + 1)}
                aria-label={`Add one ${item.book.title}`}
                className="grid h-6 w-6 place-items-center rounded-full text-primary transition hover:bg-white"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
          <p className="text-sm font-semibold text-primary">
            ${(Number(item.book.price_usd) * item.qty).toFixed(2)}
          </p>
        </div>
      ))}
      {items.length > 0 && (
        <div className="rounded-2xl bg-muted p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Order total</span>
            <span className="text-2xl font-bold text-accent">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 text-xs font-bold text-accent-foreground shadow-lg shadow-accent/20 transition hover:-translate-y-0.5 hover:brightness-105"
          >
            Checkout securely
          </button>
        </div>
      )}
    </div>
  );
}

function BookCard({ book, onAdd }: { book: Book; onAdd: () => void }) {
  const coverUrl = useCoverUrl(book.cover_url);
  const getDownload = useServerFn(getBookDownloadUrl);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const isDownloadable = !!book.file_url;

  const download = async () => {
    setErr("");
    setBusy(true);
    try {
      const result = await getDownload({ data: { book_id: book.id } });
      window.open(result.url, "_blank", "noopener");
    } catch (error: unknown) {
      setErr(error instanceof Error ? error.message : "Download failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-primary/7 bg-card shadow-[0_15px_34px_-25px_rgba(42,18,70,.42)] transition duration-200 hover:-translate-y-1.5 hover:border-primary/16 hover:shadow-[0_22px_44px_-25px_rgba(42,18,70,.55)]">
      <div className="relative bg-gradient-to-br from-primary/10 via-muted to-accent/10 p-3">
        <div className="aspect-[4/5] overflow-hidden rounded-xl bg-muted shadow-[0_13px_24px_-16px_rgba(42,18,70,.48)]">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
              No cover
            </div>
          )}
        </div>
        {isDownloadable && (
          <span className="absolute left-5 top-5 rounded-full bg-primary px-3 py-1.5 text-[.58rem] font-bold uppercase tracking-[.1em] text-primary-foreground shadow-md">
            {(book.file_kind || "pdf").toUpperCase()} · Free download
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[.58rem] font-bold uppercase tracking-[.13em] text-accent">
            Great Couples Resource
          </p>
          {!isDownloadable && (
            <span className="rounded-full bg-primary/7 px-2 py-1 text-[.55rem] font-bold uppercase tracking-[.08em] text-primary">
              Print
            </span>
          )}
        </div>
        <h3 className="mt-2 text-lg font-semibold leading-6">{book.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{book.author}</p>
        {book.isbn && <p className="mt-1 text-[.65rem] text-muted-foreground">ISBN: {book.isbn}</p>}
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-foreground/75">{book.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          {isDownloadable ? (
            <span className="text-xs font-semibold text-muted-foreground">Digital edition</span>
          ) : (
            <span className="text-xl font-bold text-accent">
              ${Number(book.price_usd).toFixed(2)}
            </span>
          )}
          {isDownloadable ? (
            <button
              onClick={download}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              Download
            </button>
          ) : (
            <button
              onClick={onAdd}
              className="rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Add to cart
            </button>
          )}
        </div>
        {err && <p className="mt-3 text-xs font-medium text-accent">{err}</p>}
      </div>
    </article>
  );
}

function CoverThumb({ src, className }: { src: string | null; className?: string }) {
  const url = useCoverUrl(src);
  return url ? (
    <img src={url} alt="" className={className} />
  ) : (
    <div className={`${className} bg-muted`} />
  );
}

function StoreHeader({ cartCount, onOpenCart }: { cartCount: number; onOpenCart: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-primary/8 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={LOGO}
            alt="Great Couples"
            className="h-9 w-9 rounded-full ring-1 ring-primary/12"
          />
          <div>
            <span className="block text-sm font-semibold leading-none text-primary">
              Great Couples
            </span>
            <span className="mt-1 block text-[.56rem] font-bold uppercase tracking-[.14em] text-muted-foreground">
              Store
            </span>
          </div>
        </Link>
        <button
          onClick={onOpenCart}
          className="relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/15 transition hover:-translate-y-0.5 hover:brightness-105"
        >
          <ShoppingCart className="h-3.5 w-3.5" /> Cart
          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-[.58rem] text-white ring-2 ring-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function CheckoutForm({
  items,
  total,
  onBack,
  onResult,
}: {
  items: { book: Book; qty: number }[];
  total: number;
  onBack: () => void;
  onResult: (result: CheckoutResult) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<PaymentMethodId>("visa");
  const [busy, setBusy] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [err, setErr] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const checkout = useServerFn(startCheckout);

  const methodInfo = PAYMENT_METHODS.find((item) => item.id === method) ?? PAYMENT_METHODS[0];
  const isMobileMoney = method === "ecocash" || method === "onemoney" || method === "innbucks";
  const isCard = method === "visa" || method === "zimswitch";
  const shown = showAll ? PAYMENT_METHODS : PAYMENT_METHODS.slice(0, 4);
  const methodDescription = isMobileMoney
    ? "Your mobile number is the payment identifier. Paynow will send a secure payment prompt to it."
    : isCard
      ? "Your card details are entered only on Paynow’s secure, PCI-compliant payment page."
      : "Paynow will open its secure payment page with the instructions for this method.";
  const submitLabel = isMobileMoney
    ? `Send ${methodInfo.label} prompt`
    : isCard
      ? "Continue to secure card payment"
      : "Continue to Paynow";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErr("");

    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Enter the name for the order.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = "Enter a valid receipt email address.";
    if (!phone.trim())
      errors.phone = isMobileMoney
        ? "Enter the mobile number that will receive the payment prompt."
        : "Enter a contact number.";
    if (phone.trim() && phone.replace(/\D/g, "").length < 8)
      errors.phone = "Enter a valid phone number.";
    if (items.length === 0) setErr("Your cart is empty. Add a resource before checking out.");
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0 || items.length === 0) return;

    setBusy(true);
    try {
      const result = await checkout({
        data: {
          customer_name: name.trim(),
          customer_email: email.trim(),
          customer_phone: phone.trim(),
          method,
          items: items.map((item) => ({ book_id: item.book.id, qty: item.qty })),
        },
      });
      if (result.kind === "web") {
        window.location.assign(result.redirect_url);
        return;
      }
      onResult(result);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Checkout could not be started. Please try again.";
      setErr(
        /paynow/i.test(message)
          ? "Paynow could not start this payment. Please verify your details and try again."
          : message,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to cart
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/7 px-3 py-1.5 text-[.58rem] font-bold uppercase tracking-[.13em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Paynow secure checkout
        </span>
      </div>

      <div className="grid gap-7 lg:grid-cols-[1.18fr_.82fr] lg:items-start">
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-white shadow-[0_18px_36px_-25px_rgba(42,18,70,.6)]">
            <span
              aria-hidden
              className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-accent/55"
            />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[.6rem] font-bold uppercase tracking-[.15em] text-white/60">
                  Selected payment method
                </p>
                <p className="mt-1 text-lg font-semibold text-white">{methodInfo.label}</p>
              </div>
              <span className="grid h-10 min-w-16 place-items-center rounded-lg bg-white px-2 shadow-sm">
                <MethodLogo
                  id={methodInfo.id}
                  label={methodInfo.label}
                  logo={methodInfo.logo}
                  className="h-6 w-14"
                />
              </span>
            </div>
            <p className="relative mt-5 max-w-md text-xs leading-5 text-white/76">
              {methodDescription}
            </p>
          </div>

          <section aria-labelledby="payment-methods-heading">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p id="payment-methods-heading" className="text-sm font-semibold text-primary">
                  Payment method
                </p>
                <p className="mt-0.5 text-[.68rem] text-muted-foreground">
                  Choose how you would like to pay.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAll((value) => !value)}
                className="text-[.65rem] font-bold text-accent hover:underline"
              >
                {showAll ? "Show less" : "See all"}
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {shown.map((paymentMethod) => (
                <label
                  key={paymentMethod.id}
                  className={`relative flex min-h-[5.75rem] cursor-pointer flex-col justify-between rounded-xl border p-3 transition ${method === paymentMethod.id ? "border-primary bg-primary/[.045] shadow-sm" : "border-primary/9 bg-white hover:border-primary/25"}`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name="method"
                    value={paymentMethod.id}
                    checked={method === paymentMethod.id}
                    onChange={() => {
                      setMethod(paymentMethod.id);
                      setErr("");
                    }}
                  />
                  <span className="flex h-7 items-center">
                    <MethodLogo
                      id={paymentMethod.id}
                      label={paymentMethod.label}
                      logo={paymentMethod.logo}
                      className="h-6 w-16"
                    />
                  </span>
                  <span className="mt-2 block pr-4 text-[.67rem] font-semibold leading-4 text-primary">
                    {paymentMethod.label}
                  </span>
                  <span
                    className={`absolute right-2.5 top-2.5 grid h-4 w-4 place-items-center rounded-full border ${method === paymentMethod.id ? "border-primary bg-primary text-primary-foreground" : "border-primary/18"}`}
                  >
                    {method === paymentMethod.id && <Check className="h-2.5 w-2.5" />}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {isMobileMoney ? (
            <section
              className="rounded-2xl border border-primary/8 bg-muted/65 p-4 sm:p-5"
              aria-labelledby="mobile-details-heading"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[.7rem] font-bold text-white">
                  1
                </span>
                <div>
                  <p id="mobile-details-heading" className="text-sm font-semibold text-primary">
                    Mobile payment details
                  </p>
                  <p className="mt-0.5 text-[.68rem] leading-5 text-muted-foreground">
                    Use the number registered to your {methodInfo.label} wallet. This is where
                    Paynow sends the approval prompt.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Field
                  label={`${methodInfo.label} mobile number`}
                  value={phone}
                  onChange={(value) => {
                    setPhone(value);
                    setFieldErrors((current) => ({ ...current, phone: "" }));
                  }}
                  error={fieldErrors.phone}
                  placeholder="e.g. 0771 234 567"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Field
                  label="Customer name"
                  value={name}
                  onChange={(value) => {
                    setName(value);
                    setFieldErrors((current) => ({ ...current, name: "" }));
                  }}
                  error={fieldErrors.name}
                  autoComplete="name"
                />
                <Field
                  label="Receipt email"
                  type="email"
                  value={email}
                  onChange={(value) => {
                    setEmail(value);
                    setFieldErrors((current) => ({ ...current, email: "" }));
                  }}
                  error={fieldErrors.email}
                  autoComplete="email"
                />
              </div>
            </section>
          ) : (
            <section
              className="rounded-2xl border border-primary/8 bg-muted/65 p-4 sm:p-5"
              aria-labelledby="card-details-heading"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-[.7rem] font-bold text-white">
                  1
                </span>
                <div>
                  <p id="card-details-heading" className="text-sm font-semibold text-primary">
                    {isCard ? "Card details, securely" : "Customer details"}
                  </p>
                  <p className="mt-0.5 text-[.68rem] leading-5 text-muted-foreground">
                    {isCard
                      ? "For your security, card number, expiry date and CVV are entered in Paynow’s protected payment form after you continue. They are never collected or stored by Great Couples."
                      : "Paynow will open the secure payment flow with the instructions for the method you selected."}
                  </p>
                </div>
              </div>
              {isCard && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/10 bg-white px-3.5 py-3">
                  <div>
                    <p className="text-[.67rem] font-semibold text-primary">Card information</p>
                    <p className="mt-0.5 text-[.6rem] text-muted-foreground">
                      Card number · expiry date · CVV
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/8 px-2.5 py-1 text-[.55rem] font-bold uppercase tracking-[.1em] text-primary">
                    Paynow
                  </span>
                </div>
              )}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Field
                  label="Customer name"
                  value={name}
                  onChange={(value) => {
                    setName(value);
                    setFieldErrors((current) => ({ ...current, name: "" }));
                  }}
                  error={fieldErrors.name}
                  autoComplete="name"
                />
                <Field
                  label="Receipt email"
                  type="email"
                  value={email}
                  onChange={(value) => {
                    setEmail(value);
                    setFieldErrors((current) => ({ ...current, email: "" }));
                  }}
                  error={fieldErrors.email}
                  autoComplete="email"
                />
                <Field
                  label="Billing phone"
                  value={phone}
                  onChange={(value) => {
                    setPhone(value);
                    setFieldErrors((current) => ({ ...current, phone: "" }));
                  }}
                  error={fieldErrors.phone}
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>
            </section>
          )}
        </div>

        <aside className="rounded-2xl border border-primary/8 bg-white p-5 shadow-[0_14px_30px_-25px_rgba(42,18,70,.38)] lg:sticky lg:top-4">
          <p className="text-[.6rem] font-bold uppercase tracking-[.15em] text-accent">
            Order summary
          </p>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.book.id} className="flex items-start justify-between gap-3 text-xs">
                <p className="min-w-0 leading-5 text-foreground/75">
                  <span className="font-semibold text-primary">{item.qty}×</span> {item.book.title}
                </p>
                <p className="shrink-0 font-semibold text-primary">
                  ${(Number(item.book.price_usd) * item.qty).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <dl className="mt-5 space-y-2 border-t border-primary/10 pt-4 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <dt>Delivery</dt>
              <dd className="font-medium text-foreground">$0.00</dd>
            </div>
            <div className="flex items-center justify-between pt-2">
              <dt className="text-sm font-semibold text-primary">Total</dt>
              <dd className="text-2xl font-bold text-accent">${total.toFixed(2)}</dd>
            </div>
          </dl>
          <div className="mt-5 rounded-xl bg-muted px-3.5 py-3 text-[.63rem] leading-5 text-muted-foreground">
            <span className="font-semibold text-primary">Secure payment:</span> your order is
            created first, then Paynow handles the payment confirmation.
          </div>
          {err && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-accent/8 px-3.5 py-3 text-xs font-medium leading-5 text-accent"
            >
              {err}
            </p>
          )}
          <button
            disabled={busy}
            type="submit"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-4 text-xs font-bold text-accent-foreground shadow-lg shadow-accent/20 transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}{" "}
            {busy ? "Processing…" : submitLabel}
          </button>
          <p className="mt-3 text-center text-[.57rem] leading-4 text-muted-foreground">
            By continuing, you will be directed to Paynow or receive a secure mobile prompt.
          </p>
        </aside>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  error,
  placeholder,
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  placeholder?: string;
  inputMode?: "email" | "tel" | "text" | "numeric" | "decimal" | "search" | "url" | "none";
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[.62rem] font-bold uppercase tracking-[.1em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/65 focus:bg-white focus:ring-4 ${error ? "border-accent/55 focus:border-accent focus:ring-accent/10" : "border-primary/10 focus:border-primary/35 focus:ring-primary/8"}`}
      />
      {error && (
        <span role="alert" className="mt-1.5 block text-[.64rem] font-medium text-accent">
          {error}
        </span>
      )}
    </label>
  );
}
