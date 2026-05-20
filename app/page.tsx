import Link from "next/link";
import { SPORTS } from "@/lib/mock";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Sports />
      <Lounge />
      <CommunityTeaser />
      <CTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 court-lines opacity-60" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[var(--color-lime)] opacity-[0.07] blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-[var(--color-amber)] opacity-[0.05] blur-3xl" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-20 lg:pt-28 pb-32">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-8 rise">
            <div className="flex items-center gap-3 mb-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-lime)] pulse-dot" />
              Établissement ouvert · Lyon 7ème · Depuis 1999
            </div>
            <h1 className="font-display text-[clamp(3rem,9vw,9rem)] leading-[0.88] tracking-[-0.03em]">
              Le club <br />
              <span className="italic text-[var(--color-lime)]">où Lyon</span> <br />
              joue<span className="font-mono text-[var(--color-amber)] text-[0.5em] align-top">,</span> mange<span className="font-mono text-[var(--color-amber)] text-[0.5em] align-top">,</span> <br />
              <span className="italic">se retrouve.</span>
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:pb-8 rise" style={{ animationDelay: ".15s" }}>
            <p className="text-lg leading-relaxed text-[var(--color-cream-dim)] mb-8 max-w-md">
              4 terrains de badminton. 5 de squash. 4 de pétanque. Un bar-restaurant.
              1 500 m² au cœur du 7ème, à deux pas du métro Jean Macé.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/reservation" className="btn-lime px-7 py-3.5 rounded-full font-medium">
                Réserver un terrain
              </Link>
              <Link href="/communaute" className="btn-ghost px-7 py-3.5 rounded-full font-medium">
                Rejoindre la communauté
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
          {[
            { k: "27", l: "ans d'histoire", sub: "depuis 1999" },
            { k: "13", l: "terrains", sub: "bad · squash · pétanque" },
            { k: "1 500", l: "m² réhabilités", sub: "sport & lounge" },
            { k: "420+", l: "adhérents actifs", sub: "communauté Bad's" },
          ].map((s, i) => (
            <div key={i} className="bg-[var(--color-ink)] p-8">
              <div className="font-display text-6xl text-[var(--color-lime)]">{s.k}</div>
              <div className="mt-2 text-sm">{s.l}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["Badminton", "Squash", "Pétanque", "Bar-Lounge", "Tournois", "After-Work", "Cours collectifs", "Privatisation"];
  return (
    <div className="relative border-y border-white/10 bg-[var(--color-ink-2)] overflow-hidden py-6">
      <div className="marquee flex gap-12 whitespace-nowrap font-display text-5xl text-[var(--color-cream)]">
        {[...words, ...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-12">
            {w}
            <span className="text-[var(--color-lime)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Sports() {
  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-28">
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">
            Section 01 · Les sports
          </div>
          <h2 className="font-display text-5xl lg:text-7xl tracking-tight">
            Trois sports.<br/>
            <span className="italic text-[var(--color-lime)]">Une seule maison.</span>
          </h2>
        </div>
        <Link href="/reservation" className="hidden md:block btn-ghost px-6 py-3 rounded-full text-sm">
          Voir disponibilités →
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {SPORTS.map((s, i) => (
          <Link
            key={s.id}
            href={`/reservation?sport=${s.id}`}
            className="lift group relative border border-white/10 rounded-3xl overflow-hidden bg-[var(--color-ink-2)] p-8 min-h-[440px] flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="font-mono text-xs text-[var(--color-muted)] tracking-widest">
                {String(i + 1).padStart(2, "0")} / 03
              </div>
              <div className="font-mono text-xs text-[var(--color-lime)] tracking-widest">{s.code}</div>
            </div>

            <SportArt sport={s.id} />

            <div>
              <h3 className="font-display text-5xl mb-2">{s.label}</h3>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-[var(--color-cream-dim)]">{s.courts} terrains disponibles</span>
                <span className="font-mono text-[var(--color-lime)]">dès {s.price}€/h</span>
              </div>
              <div className="mt-6 text-sm group-hover:text-[var(--color-lime)] transition-colors">
                Réserver →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SportArt({ sport }: { sport: string }) {
  if (sport === "badminton") {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-32 my-6">
        <g transform="translate(100 100)" stroke="currentColor" className="text-[var(--color-lime)]" fill="none" strokeWidth="1.5">
          <ellipse cx="0" cy="0" rx="65" ry="32" />
          <line x1="-65" y1="0" x2="-90" y2="0" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="-92" cy="0" r="5" fill="currentColor"/>
          <g transform="translate(60 -50)">
            <circle cx="0" cy="0" r="6" fill="currentColor"/>
            <path d="M -2 0 L -8 -15 M 2 0 L 8 -15 M 0 0 L 0 -18 M -5 -2 L -12 -10 M 5 -2 L 12 -10" stroke="currentColor"/>
          </g>
        </g>
      </svg>
    );
  }
  if (sport === "squash") {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-32 my-6">
        <g stroke="currentColor" className="text-[var(--color-amber)]" fill="none" strokeWidth="1.5">
          <rect x="40" y="40" width="120" height="120" />
          <line x1="40" y1="100" x2="160" y2="100" />
          <line x1="100" y1="40" x2="100" y2="100" />
          <circle cx="135" cy="130" r="6" fill="currentColor"/>
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="w-full h-32 my-6">
      <g className="text-[var(--color-cream)]">
        <circle cx="80" cy="110" r="20" fill="currentColor" opacity="0.9"/>
        <circle cx="120" cy="100" r="22" fill="currentColor" opacity="0.7"/>
        <circle cx="100" cy="130" r="18" fill="currentColor" opacity="0.85"/>
        <circle cx="100" cy="105" r="4" fill="var(--color-lime)"/>
      </g>
    </svg>
  );
}

function Lounge() {
  return (
    <section className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-28">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden relative bg-gradient-to-br from-[#c14d2a] via-[#ff8a3c] to-[#d6ff3e]">
            <div className="absolute inset-0 court-lines opacity-30" />
            <div className="absolute inset-0 p-10 flex flex-col justify-between text-[var(--color-ink)]">
              <div className="font-mono text-xs uppercase tracking-[0.3em]">Le Lounge · 1er étage</div>
              <div>
                <div className="font-display text-7xl lg:text-9xl leading-[0.85]">Après<br/><em>la partie.</em></div>
                <div className="mt-6 font-mono text-sm uppercase tracking-widest">Bar · Restaurant · Terrasse</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">
              Section 02 · Bar & Restaurant
            </div>
            <h2 className="font-display text-5xl lg:text-6xl tracking-tight mb-6">
              Le sport, <span className="italic text-[var(--color-amber)]">c'est aussi</span> ce qui vient après.
            </h2>
            <p className="text-[var(--color-cream-dim)] text-lg leading-relaxed">
              Carte de saison, produits locaux, cocktails maison. On vient pour jouer,
              on reste pour partager. Privatisations, anniversaires, after-works.
            </p>
          </div>
          <div className="mt-10 space-y-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            {[
              ["Privatisations", "à partir de 12 personnes"],
              ["After-work entreprise", "pack sport + apéro"],
              ["EVG / EVJF", "formules clés en main"],
              ["Anniversaires", "enfants & adultes"],
            ].map(([t, s]) => (
              <div key={t} className="bg-[var(--color-ink-2)] flex items-center justify-between p-5">
                <span className="font-display text-2xl">{t}</span>
                <span className="text-xs font-mono text-[var(--color-muted)]">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunityTeaser() {
  return (
    <section className="border-y border-white/10 bg-[var(--color-ink-2)] py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 lg:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">
              Section 03 · Communauté Bad's
            </div>
            <h2 className="font-display text-5xl lg:text-7xl tracking-tight mb-6">
              Trouve <em className="text-[var(--color-lime)]">tes partenaires</em>.<br/>
              Crée <em>ton groupe</em>.
            </h2>
            <p className="text-[var(--color-cream-dim)] text-lg mb-8 max-w-lg">
              La nouveauté du club : une vraie communauté adhérents. Crée un groupe,
              fixe un créneau, réserve ensemble. Plus jamais un terrain vide à la dernière minute.
            </p>
            <Link href="/communaute" className="btn-lime px-7 py-3.5 rounded-full inline-block font-medium">
              Explorer la communauté →
            </Link>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <div className="grid grid-cols-2 gap-3">
              {["Double mixte jeudi", "Squash After-Work", "Pétanque Lounge", "Compét' Inter-Clubs"].map((g, i) => (
                <div key={i} className={`lift border border-white/10 rounded-2xl p-5 bg-[var(--color-ink)] ${i === 1 ? "translate-y-6" : ""} ${i === 2 ? "-translate-y-3" : ""}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-lime)] text-[var(--color-ink)] grid place-items-center font-bold text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[var(--color-lime)] pulse-dot" />
                  </div>
                  <div className="font-display text-2xl leading-tight">{g}</div>
                  <div className="mt-3 text-xs font-mono text-[var(--color-muted)] flex justify-between">
                    <span>{8 + i * 3} membres</span>
                    <span className="text-[var(--color-lime)]">actif</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-28">
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-12 lg:p-20 bg-gradient-to-br from-[var(--color-ink-2)] to-[var(--color-ink-3)]">
        <div className="absolute inset-0 court-lines opacity-30" />
        <div className="relative grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-8">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-lime)] mb-4">
              On vous attend.
            </div>
            <h2 className="font-display text-5xl lg:text-8xl leading-[0.9]">
              Prêt à jouer ?<br/>
              <em className="text-[var(--color-lime)]">Le terrain</em> aussi.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
            <Link href="/reservation" className="btn-lime px-7 py-4 rounded-full text-center font-medium">
              Réserver maintenant
            </Link>
            <a href="tel:0472715050" className="btn-ghost px-7 py-4 rounded-full text-center font-medium">
              04 72 71 50 50
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
