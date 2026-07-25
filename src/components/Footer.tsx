import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import logoAsset from "@/assets/logo.jpeg.asset.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src={logoAsset.url}
              alt="Alphabet Publishers logo"
              className="h-10 w-10 shrink-0 rounded-lg object-cover shadow-card"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold">Alphabet</span>
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Publishers</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Publishing knowledge, inspiring generations. Quality books for students, educators, and lifelong learners.
          </p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="grid h-9 w-9 place-items-center rounded-md border border-border bg-background text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/shop" className="hover:text-primary">Shop</Link></li>
            <li><Link to="/contacts" className="hover:text-primary">Contacts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider">Customer Service</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Shipping & Returns</li>
            <li>Track Your Order</li>
            <li>FAQ</li>
            <li>Support</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider">Newsletter</h4>
          <p className="mt-4 text-sm text-muted-foreground">Monthly book releases and reader stories.</p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Subscribed! Welcome to Alphabet Nigerian Publishers.");
              (e.currentTarget as HTMLFormElement).reset();
            }}
          >
            <Input type="email" required placeholder="you@email.com" className="bg-background" />
            <Button type="submit">Join</Button>
          </form>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <div>© {new Date().getFullYear()} Alphabet Nigerian Publishers. All rights reserved.</div>
          <div>Publishing knowledge. Inspiring generations.</div>
        </div>
      </div>
    </footer>
  );
}
