import Link from "next/link";
import { GROUPS } from "@/lib/mock";

export default function CommunautePage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
      <div className="grid grid-cols-12 gap-6 items-end mb-12">
        <div className="col-span-12 lg:col-span-8">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">
            Communauté Bad&apos;s · 420 adhérents actifs
          </div>
          <h1 className="font-display text-5xl lg:text-7xl tracking-tight">
            Les <em className="text-[var(--color-lime)]">groupes</em> qui font<br/>
            vivre le club.
          </h1>
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
          <button className="btn-lime px-7 py-3.5 rounded-full font-medium">
            + Créer un groupe
          </button>
          <button className="btn-ghost px-7 py-3.5 rounded-full font-medium">
            Rechercher un partenaire
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {["Tous les groupes", "Badminton", "Squash", "Pétanque", "Compétition", "Débutants", "Mes groupes"].map((f, i) => (
          <button key={f}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wider border ${
              i === 0
                ? "bg-[var(--color-cream)] text-[var(--color-ink)] border-[var(--color-cream)]"
                : "border-white/10 hover:border-white/30 text-[var(--color-cream-dim)]"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Group grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GROUPS.map((g, i) => (
          <Link key={g.id} href={`/communaute/${g.id}`}
            className="lift group block border border-white/10 rounded-3xl bg-[var(--color-ink-2)] p-6 relative overflow-hidden">

            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[var(--color-lime)]/5 blur-2xl group-hover:bg-[var(--color-lime)]/15 transition" />

            <div className="relative flex items-start justify-between mb-6">
              <div className="text-4xl">{g.avatar}</div>
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Sport</div>
                <div className="font-mono text-xs text-[var(--color-lime)]">{g.sport.toUpperCase()}</div>
              </div>
            </div>

            <div className="font-display text-3xl leading-tight mb-2">{g.name}</div>

            <div className="flex items-center gap-3 text-xs font-mono text-[var(--color-muted)] mb-5">
              <span>{g.members} membres</span>
              <span>·</span>
              <span>{g.next}</span>
            </div>

            {/* Avatars */}
            <div className="flex items-center mb-5">
              {Array.from({ length: 5 }).map((_, k) => (
                <div key={k}
                  className="w-7 h-7 rounded-full -ml-2 first:ml-0 border-2 border-[var(--color-ink-2)] grid place-items-center font-mono text-[10px]"
                  style={{ background: ["#d6ff3e", "#ff8a3c", "#f4ede0", "#a8d423", "#c14d2a"][k] }}>
                  <span className="text-[var(--color-ink)]">{String.fromCharCode(65 + ((i + k) % 26))}</span>
                </div>
              ))}
              <div className="ml-2 text-xs text-[var(--color-muted)]">+{g.members - 5}</div>
            </div>

            <div className="text-sm text-[var(--color-cream-dim)] border-t border-white/10 pt-4 italic">
              « {g.last} »
            </div>

            {/* Activity bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between font-mono text-[10px] text-[var(--color-muted)] mb-1.5">
                <span>activité 7 jours</span>
                <span>{g.activity}%</span>
              </div>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-[var(--color-lime)]" style={{ width: `${g.activity}%` }} />
              </div>
            </div>
          </Link>
        ))}

        {/* Create card */}
        <div className="lift border border-dashed border-white/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center min-h-[380px] hover:border-[var(--color-lime)]/50 cursor-pointer">
          <div className="text-5xl mb-3">＋</div>
          <div className="font-display text-2xl">Crée ton groupe</div>
          <div className="text-sm text-[var(--color-muted)] mt-2 max-w-[200px]">
            Rassemble tes partenaires, fixe un créneau récurrent, réservez ensemble.
          </div>
        </div>
      </div>
    </div>
  );
}
