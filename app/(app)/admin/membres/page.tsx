"use client";

import Link from "next/link";
import { useState } from "react";
import { ADMIN_MEMBERS } from "@/lib/mock";

export default function AdminMembresPage() {
  const [filter, setFilter] = useState<"all" | "annuel" | "trimestriel" | "decouverte" | "nouveau">("all");
  const [query, setQuery] = useState("");

  const rows = ADMIN_MEMBERS.filter(m => {
    if (filter === "all") return true;
    if (filter === "nouveau") return m.status === "nouveau";
    if (filter === "decouverte") return m.type === "découverte";
    return m.type === filter;
  }).filter(m => !query || m.name.toLowerCase().includes(query.toLowerCase()) || m.email.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
      <Link href="/admin" className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-lime)]">
        ← Admin
      </Link>

      <div className="mt-4 mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-2">
            Communauté Bad&apos;s · {ADMIN_MEMBERS.length} membres affichés
          </div>
          <h1 className="font-display text-5xl tracking-tight">
            Membres <em className="text-[var(--color-lime)]">du club</em>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost px-4 py-2 rounded-full text-sm">Export CSV</button>
          <button className="btn-lime px-4 py-2 rounded-full text-sm font-medium">+ Ajouter</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher un membre…"
          className="flex-1 min-w-[200px] bg-[var(--color-ink-2)] border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-lime)]"
        />
        <div className="flex items-center gap-2 overflow-x-auto">
          {([
            ["all", "Tous"],
            ["annuel", "Annuel"],
            ["trimestriel", "Trimestriel"],
            ["decouverte", "Découverte"],
            ["nouveau", "Nouveaux"],
          ] as const).map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)}
              className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                filter === id ? "bg-[var(--color-cream)] text-[var(--color-ink)] border-[var(--color-cream)]" : "border-white/10 text-[var(--color-muted)] hover:border-white/30"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
                <th className="px-5 py-3">Membre</th>
                <th className="px-5 py-3 hidden md:table-cell">Email</th>
                <th className="px-5 py-3 hidden md:table-cell">Inscrit le</th>
                <th className="px-5 py-3">Résa</th>
                <th className="px-5 py-3">Formule</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map(m => (
                <tr key={m.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--color-lime)] text-[var(--color-ink)] grid place-items-center font-bold text-xs shrink-0">
                        {m.name.split(" ").map(p => p[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm">{m.name}</div>
                        <div className="md:hidden text-xs text-[var(--color-muted)] font-mono">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs font-mono text-[var(--color-cream-dim)] hidden md:table-cell">{m.email}</td>
                  <td className="px-5 py-3 text-xs font-mono text-[var(--color-muted)] hidden md:table-cell whitespace-nowrap">
                    {new Date(m.joined).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 font-mono text-sm text-[var(--color-lime)]">{m.bookings}</td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-[var(--color-cream-dim)]">
                      {m.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-xs text-[var(--color-muted)] hover:text-[var(--color-lime)]">Profil →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-xs text-[var(--color-muted)] mt-3 font-mono">
        {rows.length} / {ADMIN_MEMBERS.length} affichés
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-5 text-xs text-[var(--color-muted)] font-mono">
        <div className="text-[10px] uppercase tracking-widest text-[var(--color-lime)] mb-2">vue admin · à venir</div>
        Profil détaillé · historique paiements Stripe · relance abonnement expirant · envoi message ciblé.
      </div>
    </div>
  );
}
