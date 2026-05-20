import Link from "next/link";
import { notFound } from "next/navigation";
import { EVENTS } from "@/lib/mock";
import { EventRegistration } from "./event-registration";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ev = EVENTS.find(e => e.id === id);
  if (!ev) notFound();

  const placesLeft = ev.capacity - ev.enrolled;
  const occupancyPct = Math.round((ev.enrolled / ev.capacity) * 100);

  return (
    <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-10">
      <Link href="/evenements" className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-lime)]">
        ← Évènements
      </Link>

      {/* Hero */}
      <div className={`mt-6 rounded-3xl overflow-hidden relative bg-gradient-to-br ${ev.cover}`}>
        <div className="absolute inset-0 court-lines opacity-30" />
        <div className="relative p-10 lg:p-16 text-[var(--color-ink)]">
          <div className="font-mono text-xs uppercase tracking-[0.3em] mb-4">{ev.date}</div>
          <h1 className="font-display text-5xl lg:text-7xl tracking-tight leading-[0.95]">{ev.title}</h1>
          <p className="font-display text-2xl mt-3 italic">{ev.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {ev.tags.map(t => (
              <span key={t} className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--color-ink)]/15 backdrop-blur">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-2">Au programme</div>
            <p className="text-[var(--color-cream-dim)] leading-relaxed">{ev.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <InfoBox label="Quand" value={ev.date} />
            <InfoBox label="Où" value={ev.place} />
          </div>

          {/* Capacity bar */}
          <div className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-5">
            <div className="flex items-baseline justify-between mb-3">
              <div className="font-display text-2xl">{ev.enrolled} <span className="text-[var(--color-muted)] text-base font-body">/ {ev.capacity} inscrits</span></div>
              <div className="font-mono text-xs" style={{ color: placesLeft < 10 ? "#ff8a3c" : "#27ae60" }}>
                {placesLeft} places restantes
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-[var(--color-lime)]" style={{ width: `${occupancyPct}%` }} />
            </div>
          </div>

          {/* FAQ light */}
          <div className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-6">
            <div className="font-display text-2xl mb-3">Bon à savoir</div>
            <ul className="space-y-2.5 text-sm text-[var(--color-cream-dim)]">
              <li>· Inscription en ligne · paiement Stripe · facture envoyée par email</li>
              <li>· Annulation possible jusqu&apos;à 24h avant l&apos;événement (remboursement automatique)</li>
              <li>· Tu reçois un rappel push et email la veille au soir, puis 30 min avant</li>
              <li>· Tarif adhérent applicable si tu es à jour de cotisation</li>
            </ul>
          </div>
        </div>

        {/* Sidebar inscription */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="sticky top-24 rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">
              Inscription
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-display text-5xl text-[var(--color-lime)]">{ev.price} €</span>
              <span className="font-mono text-xs text-[var(--color-muted)]">/ personne</span>
            </div>
            <div className="space-y-1 text-xs text-[var(--color-cream-dim)] mb-6 pb-6 border-b border-white/10">
              <div className="flex justify-between">
                <span>Participation</span>
                <span>{ev.price.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de service</span>
                <span>0,00 €</span>
              </div>
              <div className="flex justify-between font-medium text-[var(--color-cream)] pt-1">
                <span>Total</span>
                <span>{ev.price.toFixed(2)} €</span>
              </div>
            </div>

            <EventRegistration event={{ id: ev.id, title: ev.title, date: ev.date, place: ev.place, price: ev.price, capacity: ev.capacity, enrolled: ev.enrolled }} />

            <div className="mt-5 pt-5 border-t border-white/10 font-mono text-[10px] text-[var(--color-muted)] text-center">
              Stripe · CB, Apple Pay, Google Pay
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-1">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
