import { Link } from "@tanstack/react-router";
import { ArrowRight, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-soft">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28 lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <BookMarked className="h-3.5 w-3.5" />
            Publishing excellence since 1996
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            Publishing Knowledge.<br />
            <span className="text-primary">Inspiring</span> Generations.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Alphabet Nigerian Publishers is dedicated to publishing and delivering high-quality educational, academic, and inspirational books for students, teachers, professionals, and lifelong learners.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/shop">Browse Books <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contacts">Contact Us</Link>
            </Button>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              { n: "25+", l: "Years publishing" },
              { n: "500+", l: "Titles in print" },
              { n: "500K+", l: "Readers worldwide" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-display text-2xl font-bold text-primary">{s.n}</dt>
                <dd className="text-xs text-muted-foreground">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto h-[440px] w-full max-w-lg">
          {/* Stacked book illustrations */}
          <div className="absolute left-[10%] top-[10%] h-64 w-44 rounded-md shadow-elegant animate-float"
               style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)" }}>
            <div className="flex h-full flex-col justify-between p-4">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[#A5D6A7]">Alphabet Nigerian Publishers</div>
              <div>
                <div className="font-display text-base font-semibold leading-tight text-white">Citizenship and Heritage Studies</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-white/70">Dr. TNJ Umunnakwe</div>
              </div>
              <div className="h-1 w-full rounded" style={{ background: "#A5D6A7" }} />
            </div>
          </div>

          <div className="absolute left-[38%] top-[22%] h-72 w-48 rotate-6 rounded-md shadow-elegant animate-float-delayed"
               style={{ background: "linear-gradient(135deg, #6D4C41 0%, #8D6E63 100%)" }}>
            <div className="flex h-full flex-col justify-between p-4">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[#FFF8E1]">Alphabet Nigerian Publishers</div>
              <div>
                <div className="font-display text-lg font-semibold leading-tight text-white">Digital Technologies</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-white/70">Riches Ubani</div>
              </div>
              <div className="h-1 w-full rounded" style={{ background: "#FFF8E1" }} />
            </div>
          </div>

          <div className="absolute right-[5%] top-[30%] h-60 w-40 -rotate-6 rounded-md shadow-elegant animate-float"
               style={{ background: "linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)" }}>
            <div className="flex h-full flex-col justify-between p-4">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[#A5D6A7]">Alphabet Nigerian Publishers</div>
              <div>
                <div className="font-display text-base font-semibold leading-tight text-white">Prevocational Studies</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-white/70">Princewill Umunnakwe</div>
              </div>
              <div className="h-1 w-full rounded" style={{ background: "#A5D6A7" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
