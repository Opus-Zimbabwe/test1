import { useState } from "react";
import { z } from "zod";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Reveal } from "./Reveal";

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.134 1.585 5.94L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  message: z.string().trim().min(10, "Tell us a bit more").max(2000),
});

export function Contact() {
  const [state, setState] = useState<{ status: "idle" | "ok" | "error"; msg?: string }>({
    status: "idle",
  });
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setState({
        status: "error",
        msg: parsed.error.issues[0]?.message ?? "Please check the form.",
      });
      setPending(false);
      return;
    }
    const subject = encodeURIComponent(`Great Couples enquiry from ${parsed.data.name}`);
    const body = encodeURIComponent(
      `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
    );
    window.location.href = `mailto:greatcouplestrust@gmail.com?subject=${subject}&body=${body}`;
    setState({
      status: "ok",
      msg: "Your email app will open with your enquiry. Send it there to contact our team.",
    });
    setPending(false);
  }

  return (
    <section id="contact" className="bg-white py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <div className="max-w-lg">
              <p className="section-kicker">Get in touch</p>
              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
                Book a session or ask us anything.
              </h2>
              <p className="mt-5 text-[.98rem] leading-7 text-muted-foreground">
                Face to face at our Harare HQ or online — reach out and we'll get back to you.
              </p>

              <ul className="mt-9 space-y-5">
                <li className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[.66rem] font-bold uppercase tracking-[.14em] text-muted-foreground">
                      Call / WhatsApp
                    </p>
                    <a
                      href="tel:+263777308726"
                      className="text-base font-bold text-primary transition hover:text-accent"
                    >
                      +263 777 308 726
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-green-100 text-green-600">
                    <WhatsAppIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[.66rem] font-bold uppercase tracking-[.14em] text-muted-foreground">
                      WhatsApp
                    </p>
                    <a
                      href="https://chat.whatsapp.com/Lb8qKiv5ZSbJBUqrOJF7zX"
                      target="_blank"
                      rel="noreferrer"
                      className="text-base font-bold text-primary transition hover:text-accent"
                    >
                      Join our community
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/9 text-primary">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[.66rem] font-bold uppercase tracking-[.14em] text-muted-foreground">
                      Email
                    </p>
                    <a
                      href="mailto:greatcouplestrust@gmail.com"
                      className="break-all text-base font-bold text-primary transition hover:text-accent"
                    >
                      greatcouplestrust@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[.66rem] font-bold uppercase tracking-[.14em] text-muted-foreground">
                      Headquarters
                    </p>
                    <p className="text-base font-bold text-primary">
                      15 Norwich Road, Eastlea, Harare
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form
              onSubmit={onSubmit}
              className="rounded-2xl bg-card p-6 shadow-[0_18px_42px_-26px_rgba(42,18,70,.5)] ring-1 ring-primary/8 sm:p-8"
            >
              <div className="grid gap-5">
                <label className="block">
                  <span className="text-sm font-bold text-primary">Your name</span>
                  <input
                    name="name"
                    required
                    maxLength={80}
                    className="mt-2 w-full rounded-xl border border-border bg-muted/45 px-4 py-3 text-sm outline-none transition focus:border-primary/35 focus:bg-white focus:ring-4 focus:ring-primary/8"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-primary">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={160}
                    className="mt-2 w-full rounded-xl border border-border bg-muted/45 px-4 py-3 text-sm outline-none transition focus:border-primary/35 focus:bg-white focus:ring-4 focus:ring-primary/8"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-primary">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    maxLength={2000}
                    className="mt-2 w-full resize-y rounded-xl border border-border bg-muted/45 px-4 py-3 text-sm outline-none transition focus:border-primary/35 focus:bg-white focus:ring-4 focus:ring-primary/8"
                  />
                </label>
                {state.msg && (
                  <p
                    className={`text-sm font-medium ${state.status === "ok" ? "text-primary" : "text-accent"}`}
                  >
                    {state.msg}
                  </p>
                )}
                <button
                  disabled={pending}
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20 transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" /> {pending ? "Preparing…" : "Open email to send"}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
