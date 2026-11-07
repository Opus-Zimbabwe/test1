import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle, Download, Clock } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getReceipt } from "@/lib/paynow.functions";

export const Route = createFileRoute("/store/receipt/$orderId")({
  validateSearch: (search) => ({ token: typeof search.token === "string" ? search.token : "" }),
  head: ({ params }) => ({ meta: [{ title: "Receipt — Great Couples" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ReceiptPage,
});

type ReceiptData = Awaited<ReturnType<typeof getReceipt>>;

function ReceiptPage() {
  const { orderId } = Route.useParams();
  const { token } = Route.useSearch();
  const fetchReceipt = useServerFn(getReceipt);
  const [data, setData] = useState<ReceiptData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReceipt({ data: { order_id: orderId, token } })
      .then(setData)
      .catch((e: any) => setError(e?.message ?? "Could not load receipt"));
  }, [fetchReceipt, orderId, token]);

  if (error) {
    return (
      <main className="min-h-screen grid place-items-center px-4">
        <div className="text-center"><XCircle className="mx-auto h-12 w-12 text-accent" /><h1 className="mt-3 text-xl font-bold">Receipt not found</h1><p className="text-sm text-muted-foreground">{error}</p><Link to="/store" className="mt-4 inline-block text-primary underline">Back to store</Link></div>
      </main>
    );
  }
  if (!data) {
    return <main className="min-h-screen grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></main>;
  }

  const { order, downloads } = data;
  const items = (order.items as any[]) || [];

  return (
    <main className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-3xl bg-card p-8 shadow-xl ring-1 ring-border">
        <div className="text-center">
          {order.status === "paid" ? <CheckCircle2 className="mx-auto h-14 w-14 text-primary" /> : <Clock className="mx-auto h-14 w-14 text-muted-foreground" />}
          <h1 className="mt-4 text-3xl font-black text-primary">{order.status === "paid" ? "Payment confirmed" : "Order received"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Reference {order.paynow_reference || "—"}</p>
        </div>

        <div className="mt-8 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-medium">{order.customer_name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{order.customer_email}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{order.customer_phone}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="font-medium capitalize">{order.method}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-bold capitalize">{order.status}</span></div>
        </div>

        <div className="mt-6 border-t pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Items</h2>
          <ul className="mt-3 space-y-2">
            {items.map((it, ix) => (
              <li key={ix} className="flex justify-between text-sm">
                <span>{it.qty}× {it.title}</span>
                <span className="font-medium">${(Number(it.price_usd) * it.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t pt-4">
            <span className="font-bold">Total</span>
            <span className="text-xl font-black text-accent">${Number(order.total_usd).toFixed(2)}</span>
          </div>
        </div>

        {order.status === "paid" && downloads.length > 0 && (
          <div className="mt-6 rounded-2xl bg-primary/5 p-5">
            <h2 className="font-bold text-primary flex items-center gap-2"><Download className="h-4 w-4" /> Downloads</h2>
            <ul className="mt-3 space-y-2">
              {downloads.map((d, ix) => (
                <li key={ix} className="flex items-center justify-between">
                  <span className="text-sm truncate pr-2">{d.title}</span>
                  {d.url ? <a href={d.url} target="_blank" rel="noreferrer" className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Download</a> : <span className="text-xs text-muted-foreground">Unavailable</span>}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">Download links expire in 24 hours. Return to this receipt anytime.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/store" className="text-sm text-primary hover:underline">Continue shopping</Link>
        </div>
      </div>
    </main>
  );
}