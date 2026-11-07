import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { LOGO } from "@/components/site/assets";
import { Lock, ShieldCheck, Sparkles } from "lucide-react";
import { verifyFirstLoginCode } from "@/lib/auth.functions";
import { activateClientAdmin, getSetupStatus } from "@/lib/setup.functions";
import { PaynowSetupButton } from "@/components/site/PaynowSetupButton";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Sign In — Great Couples" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AuthPage,
});

type Status = { clientAdminActivated: boolean; firstLoginCompleted: boolean };

function AuthPage() {
  const navigate = useNavigate();
  const status = useServerFn(getSetupStatus);
  const [s, setS] = useState<Status | null>(null);

  useEffect(() => {
    status().then(async (r) => {
      const next = { clientAdminActivated: r.clientAdminActivated, firstLoginCompleted: r.firstLoginCompleted };
      setS(next);
      const { data } = await supabase.auth.getSession();
      if (data.session && next.clientAdminActivated && next.firstLoginCompleted) navigate({ to: "/client-admin" });
    })
      .catch(() => setS({ clientAdminActivated: false, firstLoginCompleted: false }));
  }, [navigate, status]);

  if (!s) return <main className="min-h-screen grid place-items-center text-muted-foreground">Loading…</main>;

  return (
    <main className="min-h-screen grid place-items-center bg-gradient-to-br from-primary/5 to-accent/5 px-4 py-12">
      {s.clientAdminActivated
        ? <LoginForm needsCode={!s.firstLoginCompleted} />
        : <ActivateForm onDone={() => setS({ clientAdminActivated: true, firstLoginCompleted: false })} />}
      <PaynowSetupButton />
    </main>
  );
}

function ActivateForm({ onDone }: { onDone: () => void }) {
  const activate = useServerFn(activateClientAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError && !/already|registered|exists/i.test(signUpError.message)) throw signUpError;
      await activate({ data: { email, first_login_code: code } });
      onDone();
    } catch (e: any) { setErr(e?.message ?? "Activation failed"); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-2xl ring-1 ring-border">
      <Link to="/"><img src={LOGO} alt="" className="mx-auto h-14 w-14 rounded-full" /></Link>
      <h1 className="mt-4 text-center text-2xl font-black text-primary inline-flex items-center gap-2 w-full justify-center"><Sparkles className="h-5 w-5" /> Activate Admin</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">First-time setup — this form locks after use.</p>
      <div className="mt-6 grid gap-3">
        <Field label="Email">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input" />
        </Field>
        <Field label="Password (10+ chars, mixed case, a number)">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input" />
        </Field>
        <Field label="Choose a 4-digit first-login code">
          <input type="text" inputMode="numeric" pattern="\d{4}" maxLength={4}
            value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
            required placeholder="••••"
            className="input tracking-[0.4em] text-center font-mono" />
          <span className="mt-1 block text-[11px] text-muted-foreground">You'll enter this once on your very first sign-in, then it's retired forever.</span>
        </Field>
      </div>
      {err && <p className="mt-3 text-xs text-accent">{err}</p>}
      <button disabled={busy} className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
        {busy ? "Activating…" : "Activate & lock"}
      </button>
      <style>{`.input{width:100%;border-radius:0.75rem;border-width:1px;padding:0.625rem 0.75rem;font-size:0.875rem;outline:none} .input:focus{box-shadow:0 0 0 2px hsl(var(--primary)/0.4)}`}</style>
    </form>
  );
}

function LoginForm({ needsCode }: { needsCode: boolean }) {
  const navigate = useNavigate();
  const verifyCode = useServerFn(verifyFirstLoginCode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (needsCode) await verifyCode({ data: { code } });
      navigate({ to: "/client-admin" });
    } catch (e: any) { setErr(e?.message ?? "Sign-in failed"); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-2xl ring-1 ring-border">
      <Link to="/"><img src={LOGO} alt="" className="mx-auto h-14 w-14 rounded-full" /></Link>
      <h1 className="mt-4 text-center text-2xl font-black text-primary inline-flex items-center gap-2 w-full justify-center"><Lock className="h-5 w-5" /> Admin Sign In</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">Great Couples Store & Bookings</p>
      <div className="mt-6 grid gap-3">
        <Field label="Email"><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input" /></Field>
        <Field label="Password"><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input" /></Field>
        {needsCode && (
          <Field label={<span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> First-login verification code</span>}>
            <input type="text" inputMode="numeric" pattern="\d{4}" maxLength={4}
              value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
              required placeholder="••••"
              className="input tracking-[0.4em] text-center font-mono" />
            <span className="mt-1 block text-[11px] text-muted-foreground">One-time code you set during activation. After this login, only email + password will be used.</span>
          </Field>
        )}
      </div>
      {err && <p className="mt-3 text-xs text-accent">{err}</p>}
      <button disabled={busy} className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
      <style>{`.input{width:100%;border-radius:0.75rem;border-width:1px;padding:0.625rem 0.75rem;font-size:0.875rem;outline:none} .input:focus{box-shadow:0 0 0 2px hsl(var(--primary)/0.4)}`}</style>
    </form>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}