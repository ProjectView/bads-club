import Link from "next/link";
import { ARTICLES } from "@/lib/mock";

export default function ActualitesPage() {
  const [featured, ...rest] = ARTICLES;
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
      <div className="mb-12">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">
          Le journal · Actualités du club
        </div>
        <h1 className="font-display text-5xl lg:text-8xl tracking-tight">
          Ce qui <em className="text-[var(--color-lime)]">se passe</em> au Bad&apos;s.
        </h1>
      </div>

      {/* Featured */}
      <Link href="#" className="group block mb-12 lift">
        <div className="grid grid-cols-12 gap-6 border border-white/10 rounded-3xl overflow-hidden bg-[var(--color-ink-2)]">
          <div className={`col-span-12 md:col-span-7 aspect-[16/10] md:aspect-auto bg-gradient-to-br ${featured.cover} relative`}>
            <div className="absolute inset-0 court-lines opacity-30" />
            <div className="absolute top-6 left-6 font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink)] bg-[var(--color-ink)]/10 backdrop-blur px-3 py-1.5 rounded-full">
              ★ À la une
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-muted)] mb-3">{featured.date} · Tournoi</div>
              <h2 className="font-display text-4xl lg:text-5xl leading-[1.05] tracking-tight mb-4 group-hover:text-[var(--color-lime)] transition-colors">
                {featured.title}
              </h2>
              <p className="text-[var(--color-cream-dim)]">{featured.excerpt}</p>
            </div>
            <div className="mt-8 font-mono text-xs text-[var(--color-lime)]">Lire l'article →</div>
          </div>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {rest.map(a => (
          <Link key={a.id} href="#" className="group lift block border border-white/10 rounded-3xl bg-[var(--color-ink-2)] overflow-hidden">
            <div className={`aspect-[16/9] bg-gradient-to-br ${a.cover} relative`}>
              <div className="absolute inset-0 court-lines opacity-30" />
            </div>
            <div className="p-6">
              <div className="font-mono text-xs text-[var(--color-muted)] mb-2">{a.date}</div>
              <h3 className="font-display text-3xl leading-tight group-hover:text-[var(--color-lime)] transition-colors">
                {a.title}
              </h3>
              <p className="text-sm text-[var(--color-cream-dim)] mt-3">{a.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter */}
      <div className="mt-20 rounded-3xl border border-white/10 p-10 lg:p-16 relative overflow-hidden bg-gradient-to-br from-[var(--color-ink-2)] to-[var(--color-ink-3)]">
        <div className="absolute inset-0 court-lines opacity-30" />
        <div className="relative grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="font-display text-4xl lg:text-6xl leading-[0.95]">
              La news, <em className="text-[var(--color-lime)]">une fois par mois</em>.
            </h2>
            <p className="text-[var(--color-cream-dim)] mt-3 max-w-md">
              Tournois, nouveautés du Lounge, créneaux à pourvoir. Pas de spam, juste l'essentiel.
            </p>
          </div>
          <form className="col-span-12 lg:col-span-5 flex gap-3">
            <input
              type="email"
              placeholder="ton@email.fr"
              className="flex-1 bg-[var(--color-ink)] border border-white/10 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-[var(--color-lime)]"
            />
            <button className="btn-lime px-6 py-3.5 rounded-full text-sm font-medium">S'inscrire</button>
          </form>
        </div>
      </div>
    </div>
  );
}
