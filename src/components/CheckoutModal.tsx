import { useState } from "react";
import { Check, CreditCard, Landmark, Truck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, items, total, clear } = useCart();
  const [payment, setPayment] = useState<"card" | "bank" | "cod">("card");
  const [done, setDone] = useState(false);
  const shipping = 4.99;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    setTimeout(() => {
      clear();
      setDone(false);
      closeCheckout();
    }, 2200);
  };

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={(v) => (v ? null : closeCheckout())}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto p-0">
        {done ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground animate-in zoom-in duration-500">
              <Check className="h-10 w-10" strokeWidth={3} />
            </div>
            <h3 className="font-display text-2xl font-bold">Order Confirmed</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Thank you for your purchase. A confirmation email is on its way with tracking details.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="border-b border-border px-6 py-5">
              <DialogTitle className="font-display text-2xl">Checkout</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-6 px-6 py-5 md:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <section>
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider">Customer Information</h4>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div><Label htmlFor="name">Full name</Label><Input id="name" required /></div>
                    <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
                    <div className="sm:col-span-2"><Label htmlFor="phone">Phone</Label><Input id="phone" required /></div>
                  </div>
                </section>

                <section>
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider">Shipping</h4>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div><Label htmlFor="country">Country</Label><Input id="country" required /></div>
                    <div><Label htmlFor="state">State</Label><Input id="state" required /></div>
                    <div><Label htmlFor="city">City</Label><Input id="city" required /></div>
                    <div><Label htmlFor="addr">Address</Label><Input id="addr" required /></div>
                  </div>
                </section>

                <section>
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider">Payment Method</h4>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {[
                      { id: "card", label: "Card", icon: CreditCard },
                      { id: "bank", label: "Bank Transfer", icon: Landmark },
                      { id: "cod", label: "Cash on Delivery", icon: Truck },
                    ].map((opt) => {
                      const active = payment === opt.id;
                      const Icon = opt.icon;
                      return (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => setPayment(opt.id as "card" | "bank" | "cod")}
                          className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-all ${
                            active
                              ? "border-primary bg-primary/5 text-primary shadow-card"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              <aside className="h-fit rounded-xl border border-border bg-secondary/40 p-5">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider">Order Summary</h4>
                <div className="mt-3 max-h-52 space-y-2 overflow-y-auto">
                  {items.map(({ book, qty }) => (
                    <div key={book.id} className="flex justify-between gap-2 text-sm">
                      <span className="min-w-0 truncate">{book.title} × {qty}</span>
                      <span className="shrink-0 font-medium">${(book.price * qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                  <div className="flex justify-between border-t border-border pt-2 font-display text-base font-bold">
                    <span>Total</span><span className="text-primary">${(total + shipping).toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <Button type="submit" size="lg" disabled={items.length === 0}>Confirm Order</Button>
                  <Button type="button" variant="outline" onClick={closeCheckout}>Cancel</Button>
                </div>
              </aside>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
