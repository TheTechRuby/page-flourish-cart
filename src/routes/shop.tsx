import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookCard } from "@/components/BookCard";
import { books, categories } from "@/data/books";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Alphabet Nigerian Publishers" },
      { name: "description", content: "Browse and order books by category from Alphabet Nigerian Publishers — educational, fiction, science, children's, and more." },
      { property: "og:title", content: "Shop — Alphabet Nigerian Publishers" },
      { property: "og:description", content: "Browse and order books by category from Alphabet Nigerian Publishers." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("popular");

  const searchTerms = useMemo(() => q.trim().toLowerCase().split(/\s+/).filter(Boolean), [q]);

  const filtered = useMemo(() => {
    let list = books.filter((b) => {
      const matchesCategory = cat === "All" || b.category === cat;
      if (!matchesCategory) return false;

      if (searchTerms.length === 0) return true;

      const haystack = `${b.title} ${b.description} ${b.author}`.toLowerCase();
      return searchTerms.every((term) => haystack.includes(term));
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "newest") list = [...list].sort((a, b) => Number(b.id) - Number(a.id));
    if (sort === "popular") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [searchTerms, cat, sort]);

  return (
    <>
      <section className="border-b border-border bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">The Bookshop</div>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Every book in one place.</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Search our catalog, filter by category, and order titles with a single tap.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, description, or author…"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = c === cat;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-card"
                    : "border-border bg-background text-foreground/70 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-16 rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-foreground">No books match your search.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        )}
      </section>
    </>
  );
}
