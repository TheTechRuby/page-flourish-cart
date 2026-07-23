import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Book } from "@/data/books";

export type CartItem = { book: Book; qty: number };

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
  add: (book: Book) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  total: number;
  count: number;
};

const CartCtx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const add = useCallback((book: Book) => {
    setItems((prev) => {
      const found = prev.find((i) => i.book.id === book.id);
      if (found) return prev.map((i) => (i.book.id === book.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { book, qty: 1 }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.book.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) return remove(id);
    setItems((prev) => prev.map((i) => (i.book.id === id ? { ...i, qty } : i)));
  }, [remove]);

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((s, i) => s + i.book.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartCtx.Provider
      value={{
        items, isOpen, isCheckoutOpen,
        add, remove, setQty, clear,
        openCart: () => setOpen(true),
        closeCart: () => setOpen(false),
        openCheckout: () => { setOpen(false); setCheckoutOpen(true); },
        closeCheckout: () => setCheckoutOpen(false),
        total, count,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
