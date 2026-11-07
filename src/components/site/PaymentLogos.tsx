import { useState } from "react";

// Real payment method logos rendered as radio cards.
export type PaymentMethodId = "visa" | "zimswitch" | "ecocash" | "onemoney" | "innbucks" | "banktransfer";

export const PAYMENT_METHODS: { id: PaymentMethodId; label: string; logo: string; note: string; needsPhone?: boolean }[] = [
  { id: "visa", label: "Visa", logo: "https://www.visa.com/api/image-proxy?path=%2Fcontent%2Fdam%2Fvisa%2Fheader%2Fvectorblue.png", note: "Debit or credit card" },
  { id: "zimswitch", label: "Zimswitch", logo: "https://zimswitch.co.zw/wp-content/themes/zimswitch/assets/images/logo.svg", note: "Local ZW cards" },
  { id: "ecocash", label: "EcoCash", logo: "https://ecocash.co.zw/wp-content/uploads/2025/07/EcoCash_logo.png", note: "Mobile money · needs phone", needsPhone: true },
  { id: "onemoney", label: "OneMoney", logo: "https://www.onemoney.co.zw/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FLogoNew.ec6d796e.png&w=1920&q=75", note: "Mobile money · needs phone", needsPhone: true },
  { id: "innbucks", label: "InnBucks", logo: "https://www.innbucks.co.zw/assets/images/resources/log1.png", note: "Wallet · needs phone", needsPhone: true },
  { id: "banktransfer", label: "Bank Transfer", logo: "", note: "Direct bank transfer via Paynow" },
];

const FALLBACK_STYLES: Record<string, string> = {
  ecocash: "bg-[#e2001a] text-white",
  onemoney: "bg-[#005baa] text-white",
  innbucks: "bg-[#0f9d58] text-white",
  banktransfer: "bg-muted text-foreground",
};

/** Method logo with a branded text badge fallback when the remote image fails. */
export function MethodLogo({ id, label, logo, className = "h-6 w-10" }: { id: string; label: string; logo?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (logo && !failed) {
    return <img src={logo} alt={label} onError={() => setFailed(true)} className={`${className} object-contain`} />;
  }
  return (
    <span className={`grid h-6 w-11 shrink-0 place-items-center rounded px-1 text-[7px] font-bold uppercase leading-none tracking-tight ${FALLBACK_STYLES[id] ?? "bg-muted text-foreground"}`}>
      {label}
    </span>

  );
}
