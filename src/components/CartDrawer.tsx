import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { BookCover } from "./BookCover";

export function CartDrawer() {
  const { isOpen, closeCart, items, setQty, remove, total, openCheckout } = useCart();
  const shipping = total > 0 ? 4.99 : 0;

  return (
    <Sheet open={isOpen} onOpenChange={(v) => (v ? null : closeCart())}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="flex items-center gap-2 font-display text-xl">
            <ShoppingBag className="h-5 w-5" /> Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="h-9 w-9 text-muted-foreground" />
            </div>
            <div>
              <div className="font-display text-lg font-semibold">Your cart is empty</div>
              <p className="mt-1 text-sm text-muted-foreground">Discover our featured books to get started.</p>
            </div>
            <Button asChild onClick={closeCart}>
              <Link to="/shop">Browse Books</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {items.map(({ book, qty }) => (
                <div key={book.id} className="flex gap-3 rounded-lg border border-border bg-card p-3 animate-in fade-in slide-in-from-right-2">
                  <div className="w-16 shrink-0">
                    <BookCover book={book} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-display text-sm font-semibold">{book.title}</div>
                        <div className="text-xs text-muted-foreground">{book.author}</div>
                      </div>
                      <button
                        onClick={() => remove(book.id)}
                        aria-label="Remove"
                        className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-md border border-border bg-background">
                        <button onClick={() => setQty(book.id, qty - 1)} aria-label="Decrease" className="grid h-7 w-7 place-items-center hover:bg-secondary">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{qty}</span>
                        <button onClick={() => setQty(book.id, qty + 1)} aria-label="Increase" className="grid h-7 w-7 place-items-center hover:bg-secondary">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="font-display text-sm font-bold text-primary">₦{(book.price * qty).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border bg-secondary/30 px-6 py-5">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>₦{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span><span>₦{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-display text-lg font-bold">
                  <span>Total</span><span className="text-primary">₦{(total + shipping).toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Button size="lg" onClick={openCheckout}>Proceed to Checkout</Button>
                <Button variant="outline" onClick={closeCart}>Continue Shopping</Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
