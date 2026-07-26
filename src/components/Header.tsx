import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Menu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/tracking", label: "Track Order" },
  { to: "/contacts", label: "Contacts" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openCart } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md shadow-sm"
          : "bg-background/60 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-hero text-primary-foreground shadow-card">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold text-foreground">Alphabet</span>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Publishers</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "text-primary" : "text-foreground/70 hover:text-primary"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            id="cart-icon"
            onClick={openCart}
            aria-label={`Open cart, ${count} items`}
            className="relative grid h-10 w-10 place-items-center rounded-lg border border-border bg-background transition-colors hover:bg-secondary"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                {count}
              </span>
            )}
          </button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1 px-4">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
