"use client";

import Link from "next/link";
import { useState } from "react";
import { TODAY_BOOKINGS } from "@/lib/mock";

const SPORTS = ["Tous", "Badminton", "Squash", "Pétanque", "Tennis de table", "Baseball"];

export default function AdminReservationsPage() {
  const [filter, setFilter] = useState("Tous");
  const rows = filter === "Tous" ? TODAY_BOOKINGS : TODAY_BOOKINGS.filter(b => b.sport === filter);

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
      <Link href="/admin" className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-lime)]">
        ← Admin
      </Link>

      <div className="mt-4 mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-2">
            Pilotage opérationnel
          </div>
          <h1 className="font-display text-5xl tracking-tight">Réservations</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost px-4 py-2 rounded-full text-sm">Export CSV</button>
          <button className="btn-lime px-4 py-2 rounded-full text-sm font-medium">+ Bloquer un créneau</button>
        </div>
      </div>

      {/* Date selector + sport filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {["Hier", "Aujourd'hui", "Demain", "Cette semaine", "Mois en cours"].map((d, i) => (
          <button key={d}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm border ${
              i === 1 ? "border-[var(--color-lime)] text-[var(--color-lime)] bg-[var(--color-lime)]/5" : "border-white/10 text-[var(--color-muted)] hover:border-white/30"
            }`}>
            {d}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {SPORTS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border ${
              filter === s ? "bg-[var(--color-cream)] text-[var(--color-ink)] border-[var(--color-cream)]" : "border-white/10 text-[var(--color-muted)] hover:border-white/30"
            }`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] px-5 py-3">Heure</th>
                <th className="text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] px-5 py-3">Terrain</th>
                <th className="text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] px-5 py-3">Membre</th>
                <th className="text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] px-5 py-3 hidden md:table-cell">Sport</th>
                <th className="text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] px-5 py-3">Statut</th>
                <th className="text-right font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map(b => (
                <tr key={b.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-mono text-[var(--color-lime)] whitespace-nowrap">{b.time}</td>
                  <td className="px-5 py-3 font-mono text-xs whitespace-nowrap">{b.court}</td>
                  <td className="px-5 py-3">{b.member}</td>
                  <td className="px-5 py-3 text-xs text-[var(--color-cream-dim)] hidden md:table-cell">{b.sport}</td>
                  <td className="px-5 py-3"><StatusPill status={b.status}/></td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-xs text-[var(--color-muted)] hover:text-[var(--color-amber)] mr-3">Annuler</button>
                    <button className="text-xs text-[var(--color-muted)] hover:text-[var(--color-lime)]">Détail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-5 text-xs text-[var(--color-muted)] font-mono">
        <div className="text-[10px] uppercase tracking-widest text-[var(--color-lime)] mb-2">vue admin · à venir</div>
        Vue calendrier hebdo · gestion no-show · annulation avec remboursement Stripe · blocage maintenance terrain.
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cfg = {
    "confirmé":   { bg: "rgba(214,255,62,0.1)", color: "#d6ff3e", border: "rgba(214,255,62,0.3)" },
    "en cours":   { bg: "rgba(52,152,219,0.1)", color: "#3498db", border: "rgba(52,152,219,0.3)" },
    "en attente": { bg: "rgba(255,138,60,0.1)", color: "#ff8a3c", border: "rgba(255,138,60,0.3)" },
  }[status] ?? { bg: "rgba(255,255,255,0.05)", color: "#8b91a5", border: "rgba(255,255,255,0.1)" };
  return (
    <span className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
      {status}
    </span>
  );
}
