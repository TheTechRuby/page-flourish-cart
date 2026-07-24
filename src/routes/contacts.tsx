import { createFileRoute } from "@tanstack/react-router";
import { Clock, Headphones, Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Contact — Alphabet Nigerian Publishers" },
      { name: "description", content: "Get in touch with Alphabet Nigerian Publishers — address, phone, email, business hours, and contact form." },
      { property: "og:title", content: "Contact — Alphabet Nigerian Publishers" },
      { property: "og:description", content: "Get in touch with the Alphabet Nigerian Publishers team." },
    ],
  }),
  component: Contacts,
});

const info = [
  { icon: MapPin, label: "Address", value: "24 Editors' Lane, Publishing District, Lagos, Nigeria" },
  { icon: Phone, label: "Phone", value: "+234 (0) 812 000 0100 · +234 (0) 812 000 0200" },
  { icon: Mail, label: "Email", value: "hello@alphabetpublishers.com" },
  { icon: Clock, label: "Business Hours", value: "Mon – Fri · 9:00 AM – 6:00 PM (WAT)" },
  { icon: Headphones, label: "Customer Support", value: "support@alphabetpublishers.com" },
];

function Contacts() {
  return (
    <>
      <section className="border-b border-border bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">Contact</div>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Let's talk books.</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Whether you're an author, educator, distributor, or reader — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <ul className="space-y-4">
            {info.map((i) => {
              const Icon = i.icon;
              return (
                <li key={i.label} className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{i.label}</div>
                    <div className="mt-0.5 text-sm text-foreground">{i.value}</div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-secondary/40">
            <div className="relative aspect-[16/9] w-full">
              <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_center,theme(colors.primary/15),transparent_60%)]">
                <div className="text-center">
                  <MapPin className="mx-auto h-8 w-8 text-primary" />
                  <div className="mt-2 font-display text-lg font-semibold">Find us on the map</div>
                  <div className="text-xs text-muted-foreground">Publishing District, Lagos</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_calc(100%_-_1px),theme(colors.border)_100%),linear-gradient(90deg,transparent_calc(100%_-_1px),theme(colors.border)_100%)] bg-[size:40px_40px] opacity-40" />
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent — we'll be in touch shortly.");
            (e.currentTarget as HTMLFormElement).reset();
          }}
          className="h-fit rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <h2 className="font-display text-2xl font-bold">Send us a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">We reply to every message within one business day.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="cname">Name</Label><Input id="cname" required /></div>
            <div><Label htmlFor="cemail">Email</Label><Input id="cemail" type="email" required /></div>
          </div>
          <div className="mt-4"><Label htmlFor="csubject">Subject</Label><Input id="csubject" required /></div>
          <div className="mt-4"><Label htmlFor="cmsg">Message</Label><Textarea id="cmsg" rows={5} required /></div>
          <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">Send Message</Button>
        </form>
      </section>
    </>
  );
}
