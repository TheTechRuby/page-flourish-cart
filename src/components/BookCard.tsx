import { useRef } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookCover } from "./BookCover";
import { useCart } from "@/context/CartContext";
import type { Book } from "@/data/books";

export function BookCard({ book }: { book: Book }) {
  const { add } = useCart();
  const coverRef = useRef<HTMLDivElement>(null);

  const handleOrder = () => {
    // Fly-to-cart animation
    const el = coverRef.current;
    const cartEl = document.getElementById("cart-icon");
    if (el && cartEl) {
      const rect = el.getBoundingClientRect();
      const cartRect = cartEl.getBoundingClientRect();
      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.position = "fixed";
      clone.style.left = `${rect.left}px`;
      clone.style.top = `${rect.top}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.zIndex = "100";
      clone.style.pointerEvents = "none";
      clone.style.setProperty("--fly-x", `${cartRect.left - rect.left}px`);
      clone.style.setProperty("--fly-y", `${cartRect.top - rect.top}px`);
      clone.style.animation = "fly-to-cart 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards";
      document.body.appendChild(clone);
      setTimeout(() => clone.remove(), 750);
    }
    setTimeout(() => add(book), 400);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-card p-4 shadow-card hover-lift">
      <div ref={coverRef} className="relative">
        <BookCover book={book} />
        <Badge
          className="absolute right-2 top-2"
          variant={book.inStock ? "default" : "secondary"}
        >
          {book.inStock ? "In stock" : "Out of stock"}
        </Badge>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{book.category}</div>
        <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-foreground line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground">by {book.author}</p>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{book.description}</p>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="font-medium">{book.rating.toFixed(1)}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="font-display text-2xl font-bold text-primary">₦{book.price.toFixed(2)}</div>
          <Button
            size="sm"
            onClick={handleOrder}
            disabled={!book.inStock}
          >
            Order Now
          </Button>
        </div>
      </div>
    </article>
  );
}
