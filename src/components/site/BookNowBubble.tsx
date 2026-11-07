import { Phone } from "lucide-react";

export function BookNowBubble() {
  return (
    <a
      href="tel:+263777308726"
      aria-label="Call to book now"
      className="float-pulse fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-semibold text-accent-foreground shadow-2xl hover:scale-[1.05] transition"
    >
      <Phone className="h-5 w-5" /> Book Now
    </a>
  );
}
