import Link from "next/link";
import { EVENTS } from "@/lib/mock";

export default function EvenementsPage() {
  const [featured, ...rest] = EVENTS;
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
      <div className="mb-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">
          Agenda · Événements à venir
        </div>
        <h1 className="font-display text-5xl lg:text-7xl tracking-tight">
          On <em className="text-[var(--color-lime)]">se retrouve</em> au club.
        </h1>
        <p className="text-[var(--color-cream-dim)] mt-4 max-w-2xl">
          Tournois, soirées thématiques, Olympiade, fléchettes au Lounge :
          réserve ta place en ligne, paie d&apos;avance, et reçois les rappels la veille.
        </p>
      </div>

      {/* Featured */}
      <Link href={`/evenements/${featured.id}`} className="group block mb-10 lift">
        <div className="grid grid-cols-12 gap-6 border border-white/10 rounded-3xl overflow-hidden bg-[var(--color-ink-2)]">
          <div className={`col-span-12 md:col-span-7 aspect-[16/10] md:aspect-auto bg-gradient-to-br ${featured.cover} relative`}>
            <div className="absolute inset-0 court-lines opacity-30" />
            <div className="absolute top-6 left-6 right-6 flex justify-between text-[var(--color-ink)]">
              <span className="font-mono text-[10px] uppercase tracking-widest bg-[var(--color-ink)]/10 backdrop-blur px-3 py-1.5 rounded-full">
                ★ Prochain événement
              </span>
              <span className="font-mono text-xs">{featured.enrolled}/{featured.capacity} inscrits</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs text-[var(--color-muted)] mb-3">{featured.date} · {featured.place}</div>
              <h2 className="font-display text-4xl lg:text-5xl leading-[1.05] tracking-tight mb-3 group-hover:text-[var(--color-lime)] transition-colors">
                {featured.title}
              </h2>
              <p className="text-sm text-[var(--color-cream-dim)] mb-4">{featured.subtitle}</p>
              <div className="flex flex-wrap gap-1.5">
                {featured.tags.map(t => (
                  <span key={t} className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-[var(--color-cream-dim)]">{t}</span>
                ))}
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <div className="font-display text-3xl text-[var(--color-lime)]">{featured.price} €</div>
              <span className="font-mono text-xs text-[var(--color-lime)]">S&apos;inscrire →</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {rest.map(e => (
          <Link key={e.id} href={`/evenements/${e.id}`} className="group lift block border border-white/10 rounded-3xl bg-[var(--color-ink-2)] overflow-hidden">
            <div className={`aspect-[16/9] bg-gradient-to-br ${e.cover} relative`}>
              <div className="absolute inset-0 court-lines opacity-30" />
              <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-widest bg-[var(--color-ink)]/30 backdrop-blur px-2 py-1 rounded-full text-[var(--color-cream)]">
                {e.enrolled}/{e.capacity}
              </div>
            </div>
            <div className="p-6">
              <div className="font-mono text-xs text-[var(--color-muted)]">{e.date}</div>
              <h3 className="font-display text-3xl leading-tight mt-2 group-hover:text-[var(--color-lime)] transition-colors">{e.title}</h3>
              <div className="text-sm text-[var(--color-cream-dim)] mt-2">{e.subtitle}</div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-2xl text-[var(--color-lime)]">{e.price} €</span>
                <span className="font-mono text-xs">{e.capacity - e.enrolled} places restantes</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
