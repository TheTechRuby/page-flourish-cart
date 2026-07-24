import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, BookOpen, GraduationCap, Sparkles, Target, ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { books } from "@/data/books";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alphabet Nigerian Publishers — Publishing Knowledge. Inspiring Generations." },
      { name: "description", content: "Quality educational, academic, and inspirational books from Alphabet Nigerian Publishers. Browse our featured titles and order online." },
      { property: "og:title", content: "Alphabet Nigerian Publishers — Publishing Knowledge. Inspiring Generations." },
      { property: "og:description", content: "Quality educational, academic, and inspirational books for students, teachers, and lifelong learners." },
    ],
  }),
  component: Home,
});

const values = [
  { icon: Target, title: "Our Mission", body: "To publish accessible, accurate, and inspiring books that empower minds at every stage of learning." },
  { icon: Sparkles, title: "Our Vision", body: "A world where every reader can find a book that opens a new door — in knowledge, imagination, or purpose." },
  { icon: Award, title: "25+ Years Excellence", body: "Trusted by schools, universities, and readers across the globe for consistently high editorial standards." },
  { icon: GraduationCap, title: "Educational Impact", body: "Our titles reach classrooms in 40+ countries, shaping curricula and independent readers alike." },
  { icon: BookOpen, title: "Quality Commitment", body: "Every book is peer-reviewed, professionally edited, and produced with premium materials." },
];

function Home() {
  const featured = books.slice(0, 4);
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">About Us</div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">A publisher devoted to lasting knowledge.</h2>
          <p className="mt-4 text-muted-foreground">
            For over two decades, Alphabet Nigerian Publishers has partnered with authors, educators, and institutions to bring extraordinary books to readers everywhere.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6 shadow-card transition-transform hover:-translate-y-1">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Featured</div>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Handpicked reads for this season</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/shop">View all books <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-hero px-8 py-16 text-center shadow-elegant sm:px-16">
          <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
            Ready to find your next great read?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Explore our full catalog — from classroom favorites to bestselling fiction.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link to="/shop">Browse the Shop</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
