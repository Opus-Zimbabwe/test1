// One-time secret setup: enter the Paynow Integration Key only.
// Integration ID is fixed. Self-destructs after completion.
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Lock } from "lucide-react";
import { completePaynowSetup, getSetupStatus } from "@/lib/setup.functions";
import { LOGO } from "@/components/site/assets";

export const Route = createFileRoute("/setup-paynow")({
  head: () => ({ meta: [{ title: "Setup — Great Couples" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: SetupPage,
});

function SetupPage() {
  const check = useServerFn(getSetupStatus);
  const run = useServerFn(completePaynowSetup);
  const [status, setStatus] = useState<{ paynowConfigured: boolean; integration_id: string } | null>(null);
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => { check().then(setStatus); }, [check]);

  if (!status) return <main className="min-h-screen grid place-items-center text-muted-foreground">Loading…</main>;

  if (status.paynowConfigured && !done) {
    return (
      <main className="min-h-screen grid place-items-center bg-muted/30 px-4">
        <div className="max-w-md text-center rounded-3xl bg-card p-10 ring-1 ring-border shadow-xl">
          <Lock className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-2xl font-black text-primary">Setup already complete</h1>
          <p className="mt-3 text-sm text-muted-foreground">Paynow is configured. This page is no longer available.</p>
          <Link to="/auth" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Sign in to Admin</Link>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main className="min-h-screen grid place-items-center bg-muted/30 px-4">
        <div className="max-w-md text-center rounded-3xl bg-card p-10 ring-1 ring-border shadow-xl">
          <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 text-2xl font-black text-primary">Paynow is live</h1>
          <p className="mt-3 text-sm text-muted-foreground">Your integration key is stored securely. This page has now self-destructed.</p>
          <Link to="/auth" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Continue to Admin</Link>
        </div>
      </main>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      await run({ data: { integration_key: key } });
      setDone(true);
    } catch (e: any) { setErr(e?.message ?? "Setup failed"); }
    finally { setBusy(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 px-4 py-12">
      <form onSubmit={submit} className="mx-auto max-w-lg rounded-3xl bg-card p-8 shadow-2xl ring-1 ring-border">
        <img src={LOGO} alt="" className="mx-auto h-14 w-14 rounded-full" />
        <h1 className="mt-4 text-center text-2xl font-black text-primary">One-time Paynow Setup</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Enter your Paynow Integration Key. This page self-destructs after submission.</p>
        <div className="mt-6 grid gap-3">
          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1">Paynow Integration ID (fixed)</span>
            <input value={status.integration_id} readOnly disabled className="w-full rounded-xl border bg-muted px-3 py-2.5 text-sm text-muted-foreground cursor-not-allowed" />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1">Paynow Integration Key</span>
            <input type="password" value={key} onChange={e => setKey(e.target.value)} required className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" placeholder="Paste your key here" />
          </label>
        </div>
        {err && <p className="mt-3 text-sm text-accent">{err}</p>}
        <button disabled={busy} className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Saving…" : "Save & lock"}</button>
        <p className="mt-4 text-xs text-muted-foreground text-center">Your key never touches the browser after submission — stored server-side only.</p>
      </form>
    </main>
  );
}