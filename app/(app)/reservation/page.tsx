"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { Modal } from "@/components/modal";
import {
  getAvailability,
  createHold,
  confirmHold,
  releaseHold,
  getQuote,
  joinWaitlist,
  type AvailabilityCell,
} from "@/lib/booking/service";
import { SPORTS } from "@/lib/booking/config";
import type { Hold, PriceQuote, Slot, SportId } from "@/lib/booking/types";

const SPORT_TABS: { id: SportId; label: string; code: string; price: number; maxPlayers: number }[] = [
  { id: "badminton",    label: "Badminton",       code: "BAD", price: 18, maxPlayers: 4 },
  { id: "squash",       label: "Squash",          code: "SQS", price: 18, maxPlayers: 2 },
  { id: "petanque",     label: "Pétanque",        code: "PET", price: 20, maxPlayers: 6 },
  { id: "tennis_table", label: "Tennis de table", code: "TT",  price: 12, maxPlayers: 4 },
  { id: "baseball",     label: "Baseball",        code: "BBL", price: 25, maxPlayers: 2 },
];

const TODAY = (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })();
const DAYS = Array.from({ length: 5 }, (_, i) => {
  const d = new Date(TODAY); d.setDate(TODAY.getDate() + i); return d;
});

type SelectedSlot = { slot: Slot; hold?: Hold; quote?: PriceQuote; remainingMs: number };

export default function ReservationPage() {
  const { user } = useAuth();
  const [sport, setSport] = useState<SportId>("badminton");
  const [dayIdx, setDayIdx] = useState(0);
  const [cells, setCells] = useState<AvailabilityCell[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);

  const [selections, setSelections] = useState<SelectedSlot[]>([]);
  const [players, setPlayers] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState<string[] | null>(null);

  // Modal pour la file d'attente (remplace window.confirm)
  const [waitlistTarget, setWaitlistTarget] = useState<Slot | null>(null);
  const [waitlistConfirmed, setWaitlistConfirmed] = useState<string | null>(null);

  const isMember = !!user;
  const day = DAYS[dayIdx];
  const sportData = SPORT_TABS.find(s => s.id === sport)!;

  // Charge la grille
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getAvailability({ sportId: sport, day, currentUserId: user?.uid });
      if (!cancelled) setCells(data);
    })();
    return () => { cancelled = true; };
  }, [sport, dayIdx, day, user?.uid, refreshTick]);

  // Refresh auto toutes les 15s
  useEffect(() => {
    const t = setInterval(() => setRefreshTick(x => x + 1), 15_000);
    return () => clearInterval(t);
  }, []);

  // Décompte des holds (le 1er hold qui expire trigger la libération)
  useEffect(() => {
    if (selections.length === 0) return;
    const t = setInterval(() => {
      setSelections(prev => {
        const now = Date.now();
        let changed = false;
        const next = prev.map(s => {
          if (!s.hold) return s;
          const ms = Math.max(0, s.hold.expiresAt.getTime() - now);
          if (ms !== s.remainingMs) changed = true;
          return { ...s, remainingMs: ms };
        });
        // Si un hold a expiré : on retire la sélection
        const filtered = next.filter(s => !s.hold || s.remainingMs > 0);
        if (filtered.length < next.length) {
          setError("Un créneau a expiré, il a été libéré.");
          setRefreshTick(x => x + 1);
          return filtered;
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [selections.length]);

  // Clamp players quand le sport change
  useEffect(() => {
    setPlayers(p => Math.min(p, sportData.maxPlayers));
  }, [sport, sportData.maxPlayers]);

  const onJoinWaitlist = useCallback(async () => {
    if (!user || !waitlistTarget) return;
    const r = await joinWaitlist({ courtId: waitlistTarget.courtId, slotStart: waitlistTarget.startsAt, userId: user.uid });
    if ("error" in r) setError(r.error.message);
    else setWaitlistConfirmed(waitlistTarget.key);
    setWaitlistTarget(null);
  }, [user, waitlistTarget]);

  const onToggleSlot = useCallback(async (slot: Slot) => {
    setError(null);
    setConfirmed(null);

    if (slot.status === "booked" && user) {
      setWaitlistTarget(slot);
      return;
    }
    if (slot.status !== "free") return;

    // Si déjà sélectionné → on retire
    const existing = selections.find(s => s.slot.key === slot.key);
    if (existing) {
      if (user && existing.hold) await releaseHold(existing.hold.id, user.uid).catch(() => {});
      setSelections(prev => prev.filter(s => s.slot.key !== slot.key));
      setRefreshTick(x => x + 1);
      return;
    }

    // Non logué : juste l'ajouter visuellement
    if (!user) {
      const quote = getQuote({ courtId: slot.courtId, slotStart: slot.startsAt, isMember: false });
      setSelections(prev => [...prev, { slot, quote, remainingMs: 0 }]);
      return;
    }

    // Logué : on pose le hold
    const result = await createHold({
      courtId: slot.courtId,
      slotStart: slot.startsAt,
      userId: user.uid,
      isMember,
      isAdmin: user.role === "admin",
    });

    if ("error" in result) {
      setError(result.error.message);
      setRefreshTick(x => x + 1);
      return;
    }

    setSelections(prev => [...prev, {
      slot,
      hold: result.hold,
      quote: result.quote,
      remainingMs: result.hold.expiresAt.getTime() - Date.now(),
    }]);
    setRefreshTick(x => x + 1);
  }, [user, isMember, selections]);

  const onClearAll = useCallback(async () => {
    if (user) {
      await Promise.all(selections.map(s => s.hold ? releaseHold(s.hold.id, user.uid).catch(() => {}) : null));
    }
    setSelections([]);
    setError(null);
    setRefreshTick(x => x + 1);
  }, [user, selections]);

  const onConfirmAll = useCallback(async () => {
    if (!user || selections.length === 0) return;
    setConfirming(true);
    setError(null);

    const confirmedIds: string[] = [];
    for (const s of selections) {
      if (!s.hold) continue;
      const result = await confirmHold({
        holdId: s.hold.id,
        userId: user.uid,
        isMember,
        participants: players,
        paymentIntentId: `pi_mock_${Date.now()}`,
      });
      if ("error" in result) {
        setError(result.error.message);
        setConfirming(false);
        setRefreshTick(x => x + 1);
        return;
      }
      confirmedIds.push(result.booking.id);
    }

    setConfirming(false);
    setConfirmed(confirmedIds);
    setSelections([]);
    setRefreshTick(x => x + 1);
  }, [user, isMember, selections]);

  const totalCents = selections.reduce((sum, s) => sum + (s.quote?.total.cents ?? 0), 0);
  const minRemainingMs = selections
    .filter(s => s.hold)
    .reduce((min, s) => Math.min(min, s.remainingMs), Infinity);

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">
            Étape 01 / 03 · Choisis tes créneaux
          </div>
          <h1 className="font-display text-5xl lg:text-7xl tracking-tight">
            Réservation <em className="text-[var(--color-lime)]">en direct</em>
          </h1>
          {!user && (
            <p className="text-sm text-[var(--color-muted)] mt-3">
              Tu peux explorer les disponibilités. <Link href="/connexion?next=/reservation" className="text-[var(--color-lime)] underline">Connecte-toi</Link> pour réserver.
            </p>
          )}
        </div>
        <Stepper hasSelection={selections.length > 0} hasHold={selections.some(s => s.hold)} confirmed={!!confirmed} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Filters */}
        <aside className="col-span-12 lg:col-span-3 order-1">
          <Filters
            sport={sport} onSport={(s) => { setSport(s); onClearAll(); setError(null); }}
            dayIdx={dayIdx} onDay={(i) => { setDayIdx(i); onClearAll(); setError(null); }}
          />
        </aside>

        {/* Grid */}
        <div className="col-span-12 lg:col-span-6 order-3 lg:order-2">
          <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
              <div className="font-display text-3xl">Planning — {sportData.label}</div>
              <Legend />
            </div>
            <p className="text-xs text-[var(--color-muted)] mb-3">
              💡 Clique sur plusieurs créneaux pour les réserver en une seule fois.
            </p>

            <GridView
              cells={cells}
              selectedKeys={new Set(selections.map(s => s.slot.key))}
              onToggle={onToggleSlot}
            />
          </div>

          <div className="mt-4 text-xs font-mono text-[var(--color-muted)] flex items-center gap-4 flex-wrap">
            <span>Données live · refresh auto toutes les 15s</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime)] pulse-dot" />
              {cells.length} terrains
            </span>
          </div>

          {error && (
            <div className="mt-4 border border-[var(--color-amber)]/40 bg-[var(--color-amber)]/10 rounded-xl px-4 py-3 text-sm">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-amber)] mr-2">attention</span>
              {error}
            </div>
          )}
          {waitlistConfirmed && (
            <div className="mt-4 border border-[var(--color-amber)]/40 bg-[var(--color-amber)]/10 rounded-xl px-4 py-3 text-sm">
              <strong className="text-[var(--color-amber)]">✓ Inscrit en file d&apos;attente</strong> · tu seras notifié(e) si le créneau se libère.
            </div>
          )}
          {confirmed && (
            <div className="mt-4 border border-[var(--color-lime)]/40 bg-[var(--color-lime)]/5 rounded-xl px-4 py-3 text-sm flex items-center justify-between flex-wrap gap-2">
              <span><strong className="text-[var(--color-lime)]">✓ {confirmed.length} réservation{confirmed.length > 1 ? "s" : ""} confirmée{confirmed.length > 1 ? "s" : ""}</strong></span>
              <Link href="/mon-compte#reservations" className="text-[var(--color-lime)] underline font-mono text-xs">voir mes réservations →</Link>
            </div>
          )}
        </div>

        {/* Recap */}
        <div className="col-span-12 lg:col-span-3 order-2 lg:order-3">
          <Recap
            selections={selections}
            totalCents={totalCents}
            minRemainingMs={minRemainingMs}
            sportMaxPlayers={sportData.maxPlayers}
            players={players}
            onPlayersChange={setPlayers}
            isAuthed={!!user}
            confirming={confirming}
            onConfirmAll={onConfirmAll}
            onClearAll={onClearAll}
            onRemove={onToggleSlot}
          />
        </div>
      </div>

      {/* Modal file d'attente */}
      <Modal
        open={!!waitlistTarget}
        onClose={() => setWaitlistTarget(null)}
        title={<>Rejoindre la <em className="text-[var(--color-lime)]">file d&apos;attente</em> ?</>}
        actions={
          <>
            <button onClick={() => setWaitlistTarget(null)} className="px-5 py-2 rounded-full text-sm hover:bg-white/5 text-[var(--color-muted)]">
              Non merci
            </button>
            <button onClick={onJoinWaitlist} className="btn-lime px-5 py-2 rounded-full text-sm font-medium">
              S&apos;inscrire →
            </button>
          </>
        }
      >
        {waitlistTarget && (
          <>
            <p>Ce créneau (<b className="text-[var(--color-cream)]">{waitlistTarget.courtId} · {waitlistTarget.startsAt.toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</b>) est déjà pris.</p>
            <p className="mt-3">Si tu rejoins la file, tu seras notifié(e) immédiatement par push, email ou SMS si le créneau se libère, avec 10 min de priorité pour confirmer ta place.</p>
          </>
        )}
      </Modal>
    </div>
  );
}

// -----------------------------------------------------------------------------

function Stepper({ hasSelection, hasHold, confirmed }: { hasSelection: boolean; hasHold: boolean; confirmed: boolean }) {
  const steps = [
    { l: "1 · Créneaux", ok: hasSelection },
    { l: "2 · Récap",   ok: hasHold },
    { l: "3 · Paiement", ok: confirmed },
  ];
  return (
    <div className="hidden md:flex items-center gap-2 font-mono text-xs">
      {steps.map(s => (
        <span key={s.l} className={`px-3 py-1.5 rounded-full border ${
          s.ok ? "border-[var(--color-lime)] text-[var(--color-lime)]" : "border-white/10 text-[var(--color-muted)]"
        }`}>{s.l}</span>
      ))}
    </div>
  );
}

function Filters({
  sport, onSport, dayIdx, onDay,
}: {
  sport: SportId; onSport: (s: SportId) => void;
  dayIdx: number; onDay: (i: number) => void;
}) {
  return (
    <>
      <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">Sport</div>
      <div className="flex lg:flex-col gap-2 overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0 pb-2 lg:pb-0">
        {SPORT_TABS.map(s => (
          <button key={s.id} onClick={() => onSport(s.id)}
            className={`shrink-0 lg:shrink lg:w-full text-left p-3 lg:p-4 rounded-2xl border transition-all min-w-[140px] lg:min-w-0 ${
              sport === s.id ? "bg-[var(--color-lime)] text-[var(--color-ink)] border-[var(--color-lime)]" : "bg-[var(--color-ink-2)] border-white/10 hover:border-white/30"
            }`}>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-xl lg:text-2xl">{s.label}</span>
              <span className="font-mono text-xs">{s.code}</span>
            </div>
            <div className="text-xs mt-1 opacity-70">dès {s.price}€/h</div>
          </button>
        ))}
      </div>

      <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mt-6 lg:mt-8 mb-3">Date</div>
      <div className="flex lg:flex-col gap-2 overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0 pb-2 lg:pb-0">
        {DAYS.map((d, i) => (
          <button key={i} onClick={() => onDay(i)}
            className={`shrink-0 lg:shrink lg:w-full text-left px-4 py-3 rounded-xl border text-sm transition-all whitespace-nowrap ${
              dayIdx === i ? "border-[var(--color-lime)] text-[var(--color-lime)]" : "border-white/10 hover:border-white/30"
            }`}>
            {i === 0 ? "Auj. · " : ""}{d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
          </button>
        ))}
      </div>
    </>
  );
}

function GridView({
  cells, selectedKeys, onToggle,
}: { cells: AvailabilityCell[]; selectedKeys: Set<string>; onToggle: (s: Slot) => void }) {
  const slotTimes = cells[0]?.slots.map(s => s.startsAt) ?? [];
  return (
    <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
      <div className="min-w-[640px]">
        <div className="grid gap-1" style={{ gridTemplateColumns: `90px repeat(${slotTimes.length}, minmax(32px, 1fr))` }}>
          <div />
          {slotTimes.map((t, i) => (
            <div key={i} className="text-center font-mono text-[10px] text-[var(--color-muted)] py-2">
              {t.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </div>
          ))}
          {cells.map(cell => (
            <RowFragment key={cell.courtId} cell={cell} selectedKeys={selectedKeys} onToggle={onToggle} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RowFragment({
  cell, selectedKeys, onToggle,
}: { cell: AvailabilityCell; selectedKeys: Set<string>; onToggle: (s: Slot) => void }) {
  return (
    <>
      <div className="font-mono text-xs py-1">
        <div className="text-[var(--color-cream)]">{cell.courtId}</div>
        <div className="text-[10px] text-[var(--color-muted)]">{cell.courtLabel}</div>
      </div>
      {cell.slots.map(slot => {
        const isSelected = selectedKeys.has(slot.key);
        const zoneBar =
          slot.zone === "red"   ? "after:bg-[#e74c3c]" :
          slot.zone === "blue"  ? "after:bg-[#3498db]" :
          slot.zone === "green" ? "after:bg-[#27ae60]" : "after:bg-transparent";
        const base = `relative h-10 rounded-md text-[10px] font-mono transition-all flex items-center justify-center after:content-[''] after:absolute after:left-1 after:right-1 after:bottom-0.5 after:h-0.5 after:rounded-full ${zoneBar}`;

        if (slot.status === "past" || slot.status === "closed") {
          return <div key={slot.key} className={`${base} bg-white/[0.02] text-[var(--color-muted)]/40 cursor-not-allowed after:opacity-30`}>·</div>;
        }
        if (slot.status === "booked") {
          return (
            <button key={slot.key} onClick={() => onToggle(slot)}
              title="Pris · clique pour rejoindre la file d'attente"
              className={`${base} bg-white/[0.04] text-[var(--color-muted)] hover:bg-[var(--color-amber)]/15 hover:text-[var(--color-amber)] cursor-pointer after:opacity-40`}>
              —
            </button>
          );
        }
        if (slot.status === "held") {
          return <div key={slot.key} className={`${base} bg-[var(--color-amber)]/15 text-[var(--color-amber)] cursor-not-allowed border border-[var(--color-amber)]/30`}>⌛</div>;
        }
        if (slot.status === "blocked") {
          return <div key={slot.key} className={`${base} bg-white/[0.04] text-[var(--color-muted)] cursor-not-allowed`}>⊘</div>;
        }
        const price = (slot.priceCents / 100).toFixed(0);
        return (
          <button key={slot.key} onClick={() => onToggle(slot)}
            title={`${slot.zone ? `Zone ${slot.zone === "red" ? "Rouge" : slot.zone === "blue" ? "Bleue" : "Verte"} · ` : ""}${price}€`}
            className={`${base} ${
              isSelected
                ? "bg-[var(--color-lime)] text-[var(--color-ink)] scale-105"
                : "bg-white/[0.04] hover:bg-[var(--color-lime)]/20 hover:text-[var(--color-lime)]"
            }`}>
            {isSelected ? "✓" : price}
          </button>
        );
      })}
    </>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
      <span className="flex items-center gap-1.5"><span className="w-2 h-1 rounded-full bg-[#e74c3c]"/> Rouge 22€</span>
      <span className="flex items-center gap-1.5"><span className="w-2 h-1 rounded-full bg-[#3498db]"/> Bleue 18€</span>
      <span className="flex items-center gap-1.5"><span className="w-2 h-1 rounded-full bg-[#27ae60]"/> Verte 15€</span>
      <span className="text-[var(--color-muted)]/50">·</span>
      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[var(--color-lime)]"/> choisi</span>
      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-white/[0.04]"/> pris</span>
    </div>
  );
}

function Recap({
  selections, totalCents, minRemainingMs, sportMaxPlayers, players, onPlayersChange,
  isAuthed, confirming, onConfirmAll, onClearAll, onRemove,
}: {
  selections: SelectedSlot[];
  totalCents: number;
  minRemainingMs: number;
  sportMaxPlayers: number;
  players: number;
  onPlayersChange: (n: number) => void;
  isAuthed: boolean;
  confirming: boolean;
  onConfirmAll: () => void;
  onClearAll: () => void;
  onRemove: (slot: Slot) => void;
}) {
  if (selections.length === 0) {
    return (
      <div className="sticky top-24 rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6">
        <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">Récapitulatif</div>
        <p className="text-sm text-[var(--color-muted)]">Clique sur un ou plusieurs créneaux libres pour les ajouter à ta réservation.</p>
      </div>
    );
  }

  const mm = Math.floor(minRemainingMs / 60_000);
  const ss = Math.floor((minRemainingMs % 60_000) / 1000);
  const hasHolds = selections.some(s => s.hold);

  return (
    <div className="sticky top-24 rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
          {selections.length} créneau{selections.length > 1 ? "x" : ""} sélectionné{selections.length > 1 ? "s" : ""}
        </div>
        <button onClick={onClearAll} className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-amber)]">
          Vider
        </button>
      </div>

      {hasHolds && isFinite(minRemainingMs) && (
        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-amber)] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-amber)] pulse-dot" />
          Hold actif · {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
        </div>
      )}

      {/* Liste créneaux */}
      <div className="space-y-2 mb-5 max-h-64 overflow-y-auto pr-1">
        {selections.map(s => (
          <div key={s.slot.key} className="flex items-center justify-between gap-2 bg-white/[0.03] rounded-xl px-3 py-2">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono text-[var(--color-lime)]">{s.slot.courtId}</div>
              <div className="text-[10px] text-[var(--color-muted)]">
                {s.slot.startsAt.toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <div className="text-sm font-mono">{((s.quote?.total.cents ?? 0) / 100).toFixed(0)}€</div>
            <button onClick={() => onRemove(s.slot)} aria-label="Retirer"
              className="w-6 h-6 rounded-full hover:bg-white/5 grid place-items-center text-[var(--color-muted)] hover:text-[var(--color-amber)] transition">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 2 L8 8 M8 2 L2 8"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Nombre de joueurs */}
      <div className="mb-5 pb-5 border-b border-white/10">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-2">
          Nombre de joueurs
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPlayersChange(Math.max(1, players - 1))}
            disabled={players <= 1}
            className="w-9 h-9 rounded-full border border-white/10 hover:border-[var(--color-lime)] grid place-items-center disabled:opacity-30 disabled:cursor-not-allowed text-lg"
          >−</button>
          <div className="flex-1 text-center">
            <span className="font-display text-3xl">{players}</span>
            <span className="text-xs text-[var(--color-muted)] ml-1">/ {sportMaxPlayers} max</span>
          </div>
          <button
            onClick={() => onPlayersChange(Math.min(sportMaxPlayers, players + 1))}
            disabled={players >= sportMaxPlayers}
            className="w-9 h-9 rounded-full border border-white/10 hover:border-[var(--color-lime)] grid place-items-center disabled:opacity-30 disabled:cursor-not-allowed text-lg"
          >+</button>
        </div>
      </div>

      {/* Total */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-[var(--color-cream-dim)]">
          <span>{selections.length} créneau{selections.length > 1 ? "x" : ""} × 1 heure</span>
          <span>{(totalCents / 100).toFixed(2).replace(".", ",")} €</span>
        </div>
        <div className="border-t border-white/10 my-3" />
        <div className="flex justify-between items-baseline font-display text-2xl">
          <span>Total</span>
          <span className="text-[var(--color-lime)]">{(totalCents / 100).toFixed(2).replace(".", ",")} €</span>
        </div>
      </div>

      {!isAuthed ? (
        <Link href={`/connexion?next=/reservation`}
          className="btn-lime w-full mt-6 py-3.5 rounded-full font-medium block text-center">
          Se connecter pour réserver →
        </Link>
      ) : hasHolds ? (
        <button onClick={onConfirmAll} disabled={confirming}
          className="btn-lime w-full mt-6 py-3.5 rounded-full font-medium disabled:opacity-60 disabled:cursor-wait">
          {confirming ? "Confirmation…" : `Payer & confirmer →`}
        </button>
      ) : (
        <div className="mt-4 text-xs text-[var(--color-muted)] text-center">
          Connecte-toi pour valider la réservation.
        </div>
      )}

      <div className="font-mono text-[10px] text-[var(--color-muted)] text-center mt-3">
        Stripe · CB, Apple Pay, Google Pay
      </div>
    </div>
  );
}
