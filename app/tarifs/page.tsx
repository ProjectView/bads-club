import Link from "next/link";
import {
  EQUIPMENT_RENTAL_EUR,
  PETANQUE_PRICING,
  ZONE_LABEL,
  ZONE_PRICE_EUR,
  type Zone,
} from "@/lib/booking/config";

const ZONE_COLOR: Record<Zone, string> = {
  red: "#e74c3c",
  blue: "#3498db",
  green: "#27ae60",
};

const ZONE_HOURS: Record<Zone, string> = {
  red: "Semaine · 12h15 → 13h45  et  18h15 → 22h00",
  blue: "Semaine · 10h → 12h15 et 16h → 18h15 · Week-end · 9h → 19h30",
  green: "Semaine · 13h45 → 16h00",
};

export default function TarifsPage() {
  const zones: Zone[] = ["red", "blue", "green"];
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
      <div className="mb-12">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">
          Grille publique · Tarifs 2026
        </div>
        <h1 className="font-display text-5xl lg:text-7xl tracking-tight">
          Tarifs <em className="text-[var(--color-lime)]">terrains</em>.
        </h1>
        <p className="text-[var(--color-cream-dim)] mt-4 max-w-2xl">
          Badminton et squash partagent la même grille, organisée en trois zones tarifaires
          selon l'heure. Pétanque a son propre tarif unique. Toutes les locations sont à
          l'heure (sauf pétanque qui peut se louer à la demi-heure).
        </p>
      </div>

      {/* Zones — badminton & squash */}
      <section className="mb-16">
        <div className="font-display text-3xl mb-6">Badminton · Squash <span className="text-[var(--color-muted)] text-lg font-body">— 1 heure</span></div>
        <div className="grid md:grid-cols-3 gap-4">
          {zones.map(z => (
            <div key={z} className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6 relative overflow-hidden">
              <span className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: ZONE_COLOR[z] }} />
              <div className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: ZONE_COLOR[z] }}>
                Zone {ZONE_LABEL[z]}
              </div>
              <div className="font-display text-7xl mt-3 leading-none">{ZONE_PRICE_EUR[z]} €</div>
              <div className="font-mono text-[10px] text-[var(--color-muted)] mt-2">par heure</div>
              <div className="mt-6 text-sm text-[var(--color-cream-dim)] leading-relaxed">
                {ZONE_HOURS[z]}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pétanque + Location */}
      <section className="grid md:grid-cols-2 gap-4 mb-16">
        <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6">
          <div className="font-display text-3xl mb-4">Pétanque</div>
          <div className="space-y-3">
            <div className="flex items-baseline justify-between border-b border-white/5 pb-3">
              <span className="text-[var(--color-cream-dim)]">30 minutes</span>
              <span className="font-display text-3xl">{PETANQUE_PRICING.per30Min} €</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[var(--color-cream-dim)]">1 heure</span>
              <span className="font-display text-3xl">{PETANQUE_PRICING.perHour} €</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6">
          <div className="font-display text-3xl mb-4">Location de matériel</div>
          <div className="space-y-3">
            <div className="flex items-baseline justify-between border-b border-white/5 pb-3">
              <span className="text-[var(--color-cream-dim)]">Raquettes (bad/squash)</span>
              <span className="font-display text-3xl">{EQUIPMENT_RENTAL_EUR.racket} €</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[var(--color-cream-dim)]">Chaussures</span>
              <span className="font-display text-3xl">{EQUIPMENT_RENTAL_EUR.shoes} €</span>
            </div>
            <p className="text-xs text-[var(--color-muted)] pt-3">Volants et balles uniquement à la vente.</p>
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="rounded-3xl border border-dashed border-white/15 p-6 mb-12">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">
          Conditions
        </div>
        <ul className="space-y-2 text-sm text-[var(--color-cream-dim)]">
          <li>· Toutes les réservations s'effectuent en ligne sur ce site.</li>
          <li>· Annulation gratuite jusqu'à la veille au plus tard. Au-delà, le terrain est dû.</li>
          <li>· Horaires d'ouverture : Lun–Ven 10h00 → 22h45 · Sam–Dim 09h00 → 19h30.</li>
        </ul>
      </section>

      {/* CTA */}
      <div className="rounded-3xl border border-white/10 p-10 lg:p-14 bg-gradient-to-br from-[var(--color-ink-2)] to-[var(--color-ink-3)] relative overflow-hidden">
        <div className="absolute inset-0 court-lines opacity-30" />
        <div className="relative grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-8">
            <h2 className="font-display text-4xl lg:text-6xl leading-[0.95]">
              Choisis ton créneau<br/>
              <em className="text-[var(--color-lime)]">en moins d'une minute</em>.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-2">
            <Link href="/reservation" className="btn-lime px-7 py-4 rounded-full text-center font-medium">
              Voir le planning →
            </Link>
            <Link href="/inscription" className="btn-ghost px-7 py-4 rounded-full text-center font-medium">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
