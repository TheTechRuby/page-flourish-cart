import type { Book } from "@/data/books";

export function BookCover({ book, className = "" }: { book: Book; className?: string }) {
  const { bg, accent } = book.cover;
  return (
    <div
      className={`relative aspect-[2/3] w-full overflow-hidden rounded-md shadow-card ${className}`}
      style={{ background: `linear-gradient(135deg, ${bg} 0%, ${bg}dd 100%)` }}
      aria-label={`Cover of ${book.title}`}
    >
      <div
        className="absolute inset-y-0 left-0 w-2"
        style={{ background: `linear-gradient(180deg, ${accent} 0%, transparent 100%)`, opacity: 0.6 }}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: accent }}>
          Alphabet
        </div>
        <div>
          <div
            className="mb-2 font-display text-lg leading-tight text-white line-clamp-3"
            style={{ fontWeight: 600 }}
          >
            {book.title}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-white/70">{book.author}</div>
        </div>
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-1"
        style={{ background: accent }}
      />
    </div>
  );
}
