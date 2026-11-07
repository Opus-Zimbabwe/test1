// Self-destructing call-to-action: only renders while Paynow is NOT configured.
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound } from "lucide-react";
import { getSetupStatus } from "@/lib/setup.functions";

export function PaynowSetupButton() {
  const check = useServerFn(getSetupStatus);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let alive = true;
    check()
      .then((r) => { if (alive) setShow(!r.paynowConfigured); })
      .catch(() => { if (alive) setShow(false); });
    return () => { alive = false; };
  }, [check]);

  if (!show) return null;

  return (
    <Link
      to="/setup-paynow"
      className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-xl ring-1 ring-border transition hover:brightness-110"
    >
      <KeyRound className="h-4 w-4" />
      Add Paynow Integration Key
    </Link>
  );
}
