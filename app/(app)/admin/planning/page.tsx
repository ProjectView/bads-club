"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PLANNING_HOURS,
  PLANNING_COURTS,
  PLANNING_BOOKINGS,
  type PlanningBooking,
  type PlanningStatus,
} from "@/lib/mock";

const SPORT_FILTERS = ["Tous", "Badminton", "Squash", "Pétanque"] as const;
type SportFilter = typeof SPORT_FILTERS[number];

const STATUS_CFG: Record<PlanningStatus, { bg: string; border: string; text: string; label: string }> = {
  confirmed:   { bg: "rgba(214,255,62,0.12)",  border: "rgba(214,255,62,0.35)",  text: "#d6ff3e", label: "Confirmé" },
  in_progress: { bg: "rgba(52,152,219,0.15)",  border: "rgba(52,152,219,0.4)",   text: "#3498db", label: "En cours" },
  pending:     { bg: "rgba(255,138,60,0.12)",  border: "rgba(255,138,60,0.35)",  text: "#ff8a3c", label: "En attente" },
  blocked:     { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)", text: "#555", label: "Bloqué" },
};

const DAYS = ["Lun 02", "Mar 03", "Mer 04", "Jeu 05", "Ven 06", "Sam 07", "Dim 08"];

export default function AdminPlanningPage() {
  const [sportFilter, setSportFilter] = useState<SportFilter>("Tous");
  const [selectedDay, setSelectedDay] = useState(5); // Sam = index 5
  const [blockModal, setBlockModal] = useState<{ courtId: string; hour: string } | null>(null);
  const [detailModal, setDetailModal] = useState<PlanningBooking | null>(null);

  const courts = PLANNING_COURTS.filter(
    c => sportFilter === "Tous" || c.sport === sportFilter
  );

  function getBooking(courtId: string, hour: string): PlanningBooking | undefined {
    return PLANNING_BOOKINGS.find(b => b.courtId === courtId && b.hour === hour);
  }

  const bookedCount = PLANNING_BOOKINGS.filter(
    b => b.status !== "blocked" && courts.some(c => c.id === b.courtId)
  ).length;
  const totalSlots = courts.length * PLANNING_HOURS.length;
  const occupancy = Math.round((bookedCount / totalSlots) * 100);

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-10 py-8">
      {/* Header */}
      <Link href="/admin" className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-lime)]">
        ← Admin
      </Link>
      <div className="mt-4 mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-2">
            Planning opérationnel · Vue journée
          </div>
          <h1 className="font-display text-5xl">
            Planning <span className="text-[var(--color-lime)]">terrains</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="btn-ghost px-4 py-2 rounded-full text-sm">Export PDF</button>
          <button
            onClick={() => setBlockModal({ courtId: "", hour: "" })}
            className="btn-lime px-4 py-2 rounded-full text-sm font-medium"
          >
            + Bloquer un créneau
          </button>
        </div>
      </div>

      {/* Day selector */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        <button className="w-8 h-8 grid place-items-center rounded-full border border-white/10 text-[var(--color-muted)] hover:border-white/30 shrink-0">
          ‹
        </button>
        {DAYS.map((d, i) => (
          <button
            key={d}
            onClick={() => setSelectedDay(i)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm border transition-all ${
              i === selectedDay
                ? "border-[var(--color-lime)] text-[var(--color-lime)] bg-[var(--color-lime)]/5 font-medium"
                : "border-white/10 text-[var(--color-muted)] hover:border-white/30"
            }`}
          >
            {d}
          </button>
        ))}
        <button className="w-8 h-8 grid place-items-center rounded-full border border-white/10 text-[var(--color-muted)] hover:border-white/30 shrink-0">
          ›
        </button>
      </div>

      {/* Sport filter + occupancy summary */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2">
          {SPORT_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setSportFilter(f)}
              className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                sportFilter === f
                  ? "bg-[var(--color-cream)] text-[var(--color-ink)] border-[var(--color-cream)]"
                  : "border-white/10 text-[var(--color-muted)] hover:border-white/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {Object.entries(STATUS_CFG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm border"
                style={{ background: cfg.bg, borderColor: cfg.border }}
              />
              <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: cfg.text }}>
                {cfg.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="text-xs border-collapse" style={{ minWidth: `${80 + courts.length * 120}px` }}>
            <thead>
              {/* Sport group headers */}
              <tr className="border-b border-white/10">
                <th className="w-[80px] min-w-[80px] bg-[var(--color-ink-2)] sticky left-0 z-20" />
                {["Badminton", "Squash", "Pétanque"]
                  .filter(s => sportFilter === "Tous" || s === sportFilter)
                  .map(sport => {
                    const count = courts.filter(c => c.sport === sport).length;
                    if (count === 0) return null;
                    const color = PLANNING_COURTS.find(c => c.sport === sport)?.color ?? "#fff";
                    return (
                      <th
                        key={sport}
                        colSpan={count}
                        className="text-center py-2 px-3 font-mono text-[10px] uppercase tracking-[0.2em] border-l border-white/8"
                        style={{ color, borderBottom: `2px solid ${color}30` }}
                      >
                        {sport}
                      </th>
                    );
                  })}
              </tr>
              {/* Court labels */}
              <tr className="border-b border-white/10">
                <th className="w-[80px] min-w-[80px] px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] bg-[var(--color-ink-2)] sticky left-0 z-20">
                  Heure
                </th>
                {courts.map((c, i) => {
                  const isFirstOfSport = i === 0 || courts[i - 1].sport !== c.sport;
                  return (
                    <th
                      key={c.id}
                      className="py-2 px-1 text-center font-mono text-[10px] tracking-widest"
                      style={{
                        color: c.color,
                        borderLeft: isFirstOfSport ? "1px solid rgba(255,255,255,0.06)" : undefined,
                        minWidth: "110px",
                      }}
                    >
                      {c.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {PLANNING_HOURS.map(hour => (
                <tr key={hour} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition">
                  <td className="px-3 py-0 font-mono text-[11px] text-[var(--color-lime)] w-[80px] min-w-[80px] bg-[var(--color-ink-2)] sticky left-0 z-10 h-12">
                    {hour}
                  </td>
                  {courts.map((c, i) => {
                    const booking = getBooking(c.id, hour);
                    const isFirstOfSport = i === 0 || courts[i - 1].sport !== c.sport;
                    const cfg = booking ? STATUS_CFG[booking.status] : null;
                    return (
                      <td
                        key={c.id}
                        className="px-1 py-1 h-12"
                        style={{ borderLeft: isFirstOfSport ? "1px solid rgba(255,255,255,0.06)" : undefined }}
                      >
                        {booking ? (
                          <button
                            onClick={() => booking.status !== "blocked" && setDetailModal(booking)}
                            className="w-full h-full rounded px-2 py-1 text-left transition-all hover:brightness-125 flex flex-col justify-center"
                            style={{
                              background: cfg!.bg,
                              border: `1px solid ${cfg!.border}`,
                              backgroundImage: booking.status === "blocked"
                                ? "repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(255,255,255,0.03) 3px,rgba(255,255,255,0.03) 6px)"
                                : undefined,
                            }}
                          >
                            <span
                              className="truncate block font-mono leading-tight"
                              style={{ color: cfg!.text, fontSize: "10px" }}
                            >
                              {booking.member}
                            </span>
                            {booking.price && (
                              <span className="font-mono text-[9px] opacity-50" style={{ color: cfg!.text }}>
                                {booking.price}€
                              </span>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => setBlockModal({ courtId: c.id, hour })}
                            className="w-full h-full rounded border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-all group"
                          >
                            <span className="font-mono text-[10px] text-[var(--color-muted)] opacity-0 group-hover:opacity-60 transition">
                              + Bloquer
                            </span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom summary */}
      <div className="mt-4 flex items-center gap-6 flex-wrap">
        <div className="font-mono text-xs text-[var(--color-muted)]">
          <span className="text-[var(--color-lime)]">{bookedCount}</span> créneaux réservés ·{" "}
          <span className="text-[var(--color-lime)]">{occupancy}%</span> de taux d&apos;occupation
        </div>
        <div className="font-mono text-xs text-[var(--color-muted)]">
          {PLANNING_BOOKINGS.filter(b => b.status === "blocked" && courts.some(c => c.id === b.courtId)).length} créneaux bloqués ·{" "}
          {PLANNING_BOOKINGS.filter(b => b.status === "pending" && courts.some(c => c.id === b.courtId)).length} en attente de confirmation
        </div>
      </div>

      {/* Detail modal */}
      {detailModal && (
        <Modal onClose={() => setDetailModal(null)} title="Détail réservation">
          <div className="space-y-3">
            <Row label="Membre"  value={detailModal.member} />
            <Row label="Terrain" value={detailModal.courtId} />
            <Row label="Créneau" value={detailModal.hour} />
            <Row label="Tarif"   value={detailModal.price ? `${detailModal.price} €` : "—"} />
            <Row label="Statut"  value={STATUS_CFG[detailModal.status].label} />
          </div>
          <div className="flex gap-2 mt-6">
            <button className="flex-1 btn-ghost py-2 rounded-full text-sm">Contacter</button>
            <button
              className="flex-1 py-2 rounded-full text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
              onClick={() => setDetailModal(null)}
            >
              Annuler la résa
            </button>
          </div>
        </Modal>
      )}

      {/* Block modal */}
      {blockModal !== null && (
        <Modal onClose={() => setBlockModal(null)} title="Bloquer un créneau">
          <div className="space-y-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5">Terrain</label>
              <select
                defaultValue={blockModal.courtId}
                className="w-full bg-[var(--color-ink)] border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-lime)]"
              >
                <option value="">— Sélectionner —</option>
                {PLANNING_COURTS.map(c => (
                  <option key={c.id} value={c.id}>{c.label} · {c.sport}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5">De</label>
                <select
                  defaultValue={blockModal.hour}
                  className="w-full bg-[var(--color-ink)] border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-lime)]"
                >
                  {PLANNING_HOURS.map(h => <option key={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5">À</label>
                <select className="w-full bg-[var(--color-ink)] border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-lime)]">
                  {PLANNING_HOURS.map(h => <option key={h}>{h}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5">Motif</label>
              <input
                type="text"
                placeholder="Ex : Maintenance, Tournoi, Réservé coach…"
                className="w-full bg-[var(--color-ink)] border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-lime)]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 btn-ghost py-2.5 rounded-full text-sm" onClick={() => setBlockModal(null)}>Annuler</button>
              <button className="flex-1 btn-lime py-2.5 rounded-full text-sm font-medium" onClick={() => setBlockModal(null)}>Confirmer le blocage</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-full border border-white/10 text-[var(--color-muted)] hover:border-white/30">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
