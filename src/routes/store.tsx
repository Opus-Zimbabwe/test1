import { createFileRoute } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Download,
  Check,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useBooks, useSignedImageUrl, type Book } from "@/lib/db";
import { SiteNavigation } from "@/components/site/SiteNavigation";
import { StoreIntro, StoreCollection } from "@/components/site/StoreFront";
import { Footer } from "@/components/site/Footer";
import { AmbientBackdrop } from "@/components/site/AmbientBackdrop";
import "@/components/site/editorial.css";
import "@/components/site/experience.css";
import "@/components/site/store.css";
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
  return useSignedImageUrl(coverUrl, "book-covers");
}

function StorePage() {
  const { rows: dbBooks, loading } = useBooks();
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
      <main className="gc-editorial gc-store min-h-screen bg-muted">
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
    <main className="gc-editorial gc-store min-h-screen bg-background">
      <AmbientBackdrop />
      <StoreHeader cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />

      <div className="gc-store-back">
        <a href="/">
          <ArrowLeft size={18} /> Back home
        </a>
      </div>
      <StoreIntro books={books} />
      <StoreCollection
        books={books}
        loading={loading}
        renderBook={(book) => (
          <BookCard key={book.id} book={book} onAdd={() => addToCart(book.id)} />
        )}
      />
      <Footer />

      <Dialog.Root open={cartOpen} onOpenChange={setCartOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="gc-dialog-overlay" />
          <Dialog.Content className={`gc-store-cart-dialog ${checkout ? "is-checkout" : ""}`}>
            <div className="gc-store-cart-heading">
              <Dialog.Title>{checkout ? "Complete your order" : "Your cart"}</Dialog.Title>
              <Dialog.Close aria-label="Close cart">
                <X size={23} />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Review quantities and continue to secure payment.
            </Dialog.Description>
            <div className="gc-store-cart-body">
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
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
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
  const [detailsOpen, setDetailsOpen] = useState(false);
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
    <article className="gc-store-book" id={`book-${book.id}`}>
      <div className="gc-book-cover">
        {coverUrl ? (
          <img src={coverUrl} alt={book.title} loading="lazy" />
        ) : (
          <div className="gc-book-type">
            <span>{book.title}</span>
            <small>{book.author}</small>
          </div>
        )}
      </div>
      <div className="gc-book-details">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p className="gc-book-description">{book.description}</p>
        <button
          className="gc-book-discover"
          aria-label={`Read about ${book.title}`}
          onClick={() => setDetailsOpen(true)}
        >
          Inside this book <ArrowRight size={19} />
        </button>
        <div className="gc-book-purchase">
          <strong>
            {isDownloadable ? "Digital edition" : `$${Number(book.price_usd).toFixed(2)}`}
          </strong>
          {isDownloadable ? (
            <button onClick={download} disabled={busy}>
              {busy ? <Loader2 size={17} className="animate-spin" /> : <Download size={17} />}
              Download
            </button>
          ) : (
            <button onClick={onAdd} aria-label={`Add ${book.title} to cart`}>
              Add to cart <Plus size={17} />
            </button>
          )}
        </div>
        {err && <p role="alert">{err}</p>}
      </div>
      <Dialog.Root open={detailsOpen} onOpenChange={setDetailsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="gc-dialog-overlay" />
          <Dialog.Content className="gc-book-detail-dialog">
            <Dialog.Close aria-label="Close book details" className="gc-book-detail-close">
              <X size={23} />
            </Dialog.Close>
            <div className="gc-book-detail-art">
              {coverUrl && <img src={coverUrl} alt={`${book.title} cover`} />}
            </div>
            <div className="gc-book-detail-copy">
              <p>{book.author}</p>
              <Dialog.Title>{book.title}</Dialog.Title>
              <Dialog.Description>{book.description}</Dialog.Description>
              <strong>
                {isDownloadable ? "Digital edition" : `$${Number(book.price_usd).toFixed(2)}`}
              </strong>
              <button
                className="gc-button"
                disabled={busy}
                onClick={() => {
                  if (isDownloadable) {
                    download();
                    return;
                  }
                  setDetailsOpen(false);
                  requestAnimationFrame(onAdd);
                }}
              >
                {isDownloadable ? "Download" : "Add to cart"}
                {isDownloadable ? <Download size={20} /> : <Plus size={20} />}
              </button>
              {err && <p role="alert">{err}</p>}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
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
    <SiteNavigation
      store
      action={
        <button
          className="gc-cart-trigger"
          onClick={onOpenCart}
          aria-label={`Open cart, ${cartCount} items`}
        >
          <ShoppingCart size={20} />
          <span>Cart</span>
          <b>{cartCount}</b>
        </button>
      }
    />
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
  const detailsRef = useRef<HTMLElement>(null);
  const [scrollRequest, setScrollRequest] = useState(0);
  useEffect(() => {
    if (!scrollRequest) return;
    const frame = requestAnimationFrame(() =>
      detailsRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [scrollRequest]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<PaymentMethodId>("visa");
  const [busy, setBusy] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [err, setErr] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const checkout = useServerFn(startCheckout);

  const methodInfo = PAYMENT_METHODS.find((item) => item.id === method) ?? PAYMENT_METHODS[0]!;
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
    if (!name.trim()) errors["name"] = "Enter the name for the order.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      errors["email"] = "Enter a valid receipt email address.";
    if (!phone.trim())
      errors["phone"] = isMobileMoney
        ? "Enter the mobile number that will receive the payment prompt."
        : "Enter a contact number.";
    if (phone.trim() && phone.replace(/\D/g, "").length < 8)
      errors["phone"] = "Enter a valid phone number.";
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
        if (!result.redirect_url)
          throw new Error("The payment provider did not return a checkout link.");
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
                      setScrollRequest((value) => value + 1);
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
              ref={detailsRef}
              style={{ scrollMarginTop: 24 }}
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
                  error={fieldErrors["phone"]}
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
                  error={fieldErrors["name"]}
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
                  error={fieldErrors["email"]}
                  autoComplete="email"
                />
              </div>
            </section>
          ) : (
            <section
              className="rounded-2xl border border-primary/8 bg-muted/65 p-4 sm:p-5"
              ref={detailsRef}
              style={{ scrollMarginTop: 24 }}
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
                  error={fieldErrors["name"]}
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
                  error={fieldErrors["email"]}
                  autoComplete="email"
                />
                <Field
                  label="Billing phone"
                  value={phone}
                  onChange={(value) => {
                    setPhone(value);
                    setFieldErrors((current) => ({ ...current, phone: "" }));
                  }}
                  error={fieldErrors["phone"]}
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
  error?: string | undefined;
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
