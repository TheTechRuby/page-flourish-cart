import { useState } from "react";
import { Check, CreditCard, Landmark, Truck } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { addOrder, createTrackingNumber, type Order } from "@/lib/order-tracking";

export function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, items, total, clear } = useCart();
  const router = useRouter();
  const [payment, setPayment] = useState<"card" | "bank" | "cod">("card");
  const [done, setDone] = useState(false);
  const shipping = 4.99;

  const sendTrackingEmail = async (order: Order) => {
    try {
      const response = await fetch("/api/send-tracking-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.warn("Email sending failed:", error.message);
      }
    } catch (error) {
      console.warn("Could not send tracking email:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const customerName = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const address = String(formData.get("addr") ?? "");
    const city = String(formData.get("city") ?? "");
    const state = String(formData.get("state") ?? "");
    const country = String(formData.get("country") ?? "");
    const trackingNumber = createTrackingNumber();

    const order: Order = {
      id: trackingNumber,
      trackingNumber,
      customerName,
      email,
      phone,
      address,
      city,
      state,
      country,
      paymentMethod: payment,
      items: items.map(({ book, qty }) => ({ id: book.id, title: book.title, qty, price: book.price })),
      subtotal: total,
      shipping,
      total: total + shipping,
      placedAt: new Date().toISOString(),
      status: "processing",
      updates: [
        { status: "processing", message: "Your order has been received and is being prepared.", timestamp: new Date().toISOString() },
        { status: "packed", message: "Your books are being packed for dispatch.", timestamp: new Date(Date.now() + 60_000).toISOString() },
        { status: "shipped", message: "Your package is on the way to the courier hub.", timestamp: new Date(Date.now() + 3_600_000).toISOString() },
        { status: "delivered", message: "Your package will arrive shortly.", timestamp: new Date(Date.now() + 7_200_000).toISOString() },
      ],
    };

    addOrder(order);
    sendTrackingEmail(order);
    setDone(true);
    setTimeout(() => {
      clear();
      setDone(false);
      closeCheckout();
      router.navigate({ to: "/tracking" });
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
                    <div><Label htmlFor="name">Full name</Label><Input id="name" name="name" required /></div>
                    <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
                    <div className="sm:col-span-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" required /></div>
                  </div>
                </section>

                <section>
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider">Shipping</h4>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div><Label htmlFor="country">Country</Label><Input id="country" name="country" required /></div>
                    <div><Label htmlFor="state">State</Label><Input id="state" name="state" required /></div>
                    <div><Label htmlFor="city">City</Label><Input id="city" name="city" required /></div>
                    <div><Label htmlFor="addr">Address</Label><Input id="addr" name="addr" required /></div>
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
                      <span className="shrink-0 font-medium">₦{(book.price * qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₦{total.toFixed(2)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>₦{shipping.toFixed(2)}</span></div>
                  <div className="flex justify-between border-t border-border pt-2 font-display text-base font-bold">
                    <span>Total</span><span className="text-primary">₦{(total + shipping).toFixed(2)}</span>
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
