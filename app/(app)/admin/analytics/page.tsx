"use client";

import Link from "next/link";
import { useState } from "react";
import {
  REVENUE_7D,
  SPORT_ANALYTICS,
  OCCUPANCY_HEATMAP,
  TOP_MEMBERS,
  ADMIN_STATS,
} from "@/lib/mock";

const PERIODS = ["7 jours", "30 jours", "3 mois"] as const;
type Period = typeof PERIODS[number];

const HEATMAP_HOURS = ["10h","11h","12h","13h","14h","15h","16h","17h","18h","19h","20h","21h"];
const HEATMAP_DAYS  = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

function heatColor(value: number): string {
  // 0 → ink, 100 → lime
  const alpha = Math.min(value / 100, 1);
  if (alpha < 0.3) return `rgba(214,255,62,${alpha * 0.4})`;
  if (alpha < 0.6) return `rgba(214,255,62,${alpha * 0.55})`;
  return `rgba(214,255,62,${alpha * 0.85})`;
}

const maxRevenue = Math.max(...REVENUE_7D.map(d => d.revenue));

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7 jours");

  const totalRevenue = REVENUE_7D.reduce((s, d) => s + d.revenue, 0);
  const totalBookings = REVENUE_7D.reduce((s, d) => s + d.bookings, 0);
  const avgPerBooking = Math.round(totalRevenue / totalBookings);
  const maxOccupancy = Math.max(...SPORT_ANALYTICS.map(s => s.occupancy));

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
      {/* Header */}
      <Link href="/admin" className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-lime)]">
        ← Admin
      </Link>
      <div className="mt-4 mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-2">
            Tableau de bord analytique
          </div>
          <h1 className="font-display text-5xl">
            Analytics <span className="text-[var(--color-lime)]">du club</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`font-mono text-xs px-4 py-2 rounded-full border transition-all ${
                period === p
                  ? "border-[var(--color-lime)] text-[var(--color-lime)] bg-[var(--color-lime)]/5"
                  : "border-white/10 text-[var(--color-muted)] hover:border-white/30"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard value={`${totalRevenue.toLocaleString("fr-FR")} €`} label="Chiffre d'affaires" color="#d6ff3e" trend="+8% vs période préc." />
        <KpiCard value={totalBookings}       label="Réservations"       color="#3498db" trend="+12% vs période préc." />
        <KpiCard value={`${ADMIN_STATS.occupancyRate}%`} label="Taux d'occupation" color="#ff8a3c" trend="objectif 75%" />
        <KpiCard value={`${avgPerBooking} €`} label="Panier moyen"      color="#27ae60" trend="+3% vs période préc." />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue bar chart */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)] mb-1">Chiffre d'affaires</div>
              <div className="font-display text-3xl">{totalRevenue.toLocaleString("fr-FR")} €</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] text-[var(--color-muted)]">Réservations</div>
              <div className="font-display text-2xl text-[var(--color-lime)]">{totalBookings}</div>
            </div>
          </div>
          {/* Bars */}
          <div className="flex items-end gap-2 h-40">
            {REVENUE_7D.map(d => {
              const h = Math.max((d.revenue / maxRevenue) * 100, 4);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="font-mono text-[9px] text-[var(--color-muted)] opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {d.revenue.toLocaleString("fr-FR")} €
                  </div>
                  <div className="w-full rounded-t relative overflow-hidden" style={{ height: `${h}%` }}>
                    <div
                      className="absolute inset-0 rounded-t transition-all"
                      style={{ background: "rgba(214,255,62,0.25)", border: "1px solid rgba(214,255,62,0.3)", borderBottom: "none" }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-t transition-all"
                      style={{ height: "30%", background: "rgba(214,255,62,0.5)" }}
                    />
                  </div>
                  <div className="font-mono text-[10px] text-[var(--color-muted)]">{d.day}</div>
                  <div className="font-mono text-[9px] text-[var(--color-lime)] opacity-60">{d.bookings}</div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-4 mt-3">
            <Legend color="rgba(214,255,62,0.3)" label="Revenus" />
            <Legend color="rgba(214,255,62,0.6)" label="Pic" />
          </div>
        </div>

        {/* Occupation par sport */}
        <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)] mb-1">Occupation par sport</div>
          <div className="font-display text-3xl mb-6">Terrains</div>
          <div className="space-y-5">
            {SPORT_ANALYTICS.map(s => (
              <div key={s.sport}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm">{s.sport}</span>
                    <span className="font-mono text-[10px] text-[var(--color-muted)] ml-2">{s.courts} terrains</span>
                  </div>
                  <span className="font-mono text-sm font-bold" style={{ color: s.color }}>{s.occupancy}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(s.occupancy / maxOccupancy) * 100}%`,
                      background: s.color,
                      opacity: 0.75,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="font-mono text-[9px] text-[var(--color-muted)]">{s.bookings} résa</span>
                  <span className="font-mono text-[9px] text-[var(--color-muted)]">{s.revenue.toLocaleString("fr-FR")} €</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="font-mono text-[10px] text-[var(--color-muted)] mb-2 uppercase tracking-widest">Répartition CA</div>
            <div className="h-3 rounded-full overflow-hidden flex">
              {SPORT_ANALYTICS.map(s => {
                const totalRev = SPORT_ANALYTICS.reduce((a, b) => a + b.revenue, 0);
                return (
                  <div
                    key={s.sport}
                    title={`${s.sport} · ${Math.round((s.revenue / totalRev) * 100)}%`}
                    style={{ width: `${(s.revenue / totalRev) * 100}%`, background: s.color, opacity: 0.7 }}
                  />
                );
              })}
            </div>
            <div className="flex gap-3 mt-2">
              {SPORT_ANALYTICS.map(s => {
                const totalRev = SPORT_ANALYTICS.reduce((a, b) => a + b.revenue, 0);
                return (
                  <div key={s.sport} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color, opacity: 0.7 }} />
                    <span className="font-mono text-[9px] text-[var(--color-muted)]">
                      {s.sport.slice(0, 3)} {Math.round((s.revenue / totalRev) * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mb-6">
        {/* Heatmap heures de pointe */}
        <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)] mb-1">Heures de pointe</div>
          <div className="font-display text-3xl mb-5">Affluence</div>
          <div className="overflow-x-auto">
            <table className="text-[10px] font-mono border-collapse" style={{ minWidth: "400px" }}>
              <thead>
                <tr>
                  <th className="w-8 text-left pb-2 text-[var(--color-muted)]" />
                  {HEATMAP_HOURS.map(h => (
                    <th key={h} className="pb-2 text-center text-[var(--color-muted)] font-normal" style={{ minWidth: "32px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HEATMAP_DAYS.map((day, di) => (
                  <tr key={day}>
                    <td className="pr-2 py-0.5 text-[var(--color-muted)] whitespace-nowrap">{day}</td>
                    {OCCUPANCY_HEATMAP[di].map((val, hi) => (
                      <td key={hi} className="py-0.5 px-0.5">
                        <div
                          title={`${day} ${HEATMAP_HOURS[hi]} · ${val}%`}
                          className="rounded"
                          style={{
                            width: "28px",
                            height: "20px",
                            background: heatColor(val),
                            border: "1px solid rgba(255,255,255,0.03)",
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="font-mono text-[9px] text-[var(--color-muted)]">Faible</span>
            <div className="flex gap-0.5">
              {[5,20,40,60,80,100].map(v => (
                <div key={v} className="w-5 h-3 rounded-sm" style={{ background: heatColor(v) }} />
              ))}
            </div>
            <span className="font-mono text-[9px] text-[var(--color-muted)]">Saturé</span>
          </div>
        </div>

        {/* Top membres */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)] mb-1">Fidélité</div>
          <div className="font-display text-3xl mb-5">Top membres</div>
          <div className="space-y-3">
            {TOP_MEMBERS.map((m, i) => (
              <div key={m.name} className="flex items-center gap-3 py-2 border-b border-white/5">
                <div
                  className="w-7 h-7 rounded-full grid place-items-center font-bold text-xs shrink-0"
                  style={{
                    background: i === 0 ? "#d6ff3e" : i === 1 ? "#ff8a3c" : "rgba(255,255,255,0.08)",
                    color: i < 2 ? "#0a0a0a" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate flex items-center gap-2">
                    {m.name}
                    {m.badge && (
                      <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-[var(--color-lime)]/10 text-[var(--color-lime)] uppercase tracking-widest">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[10px] text-[var(--color-muted)]">{m.bookings} résa</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-sm text-[var(--color-lime)]">{m.revenue.toLocaleString("fr-FR")} €</div>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/membres"
            className="block text-center font-mono text-xs text-[var(--color-lime)] hover:underline mt-4"
          >
            Voir tous les membres →
          </Link>
        </div>
      </div>

      {/* Quick stats footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Annulations",     value: "4,2%",  note: "vs 6,1% mois dernier",  color: "#27ae60" },
          { label: "No-shows",        value: "1,8%",  note: "stable",                 color: "#d6ff3e" },
          { label: "Nouveaux membres",value: `+${ADMIN_STATS.newMembersThisMonth}`,note: "ce mois", color: "#3498db" },
          { label: "Liste d'attente", value: "12",    note: "créneaux en attente",    color: "#ff8a3c" },
        ].map(item => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-4">
            <div className="font-display text-3xl" style={{ color: item.color }}>{item.value}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mt-1">{item.label}</div>
            <div className="font-mono text-[9px] text-[var(--color-cream-dim)] mt-0.5">{item.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiCard({ value, label, color, trend }: { value: string | number; label: string; color: string; trend?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-5 relative overflow-hidden">
      <span className="absolute top-0 left-0 right-0 h-0.5" style={{ background: color }} />
      <div className="font-display text-4xl lg:text-5xl mt-1" style={{ color }}>{value}</div>
      <div className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted)] mt-2">{label}</div>
      {trend && <div className="text-[10px] font-mono text-[var(--color-cream-dim)] mt-1">{trend}</div>}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block w-3 h-3 rounded-sm" style={{ background: color }} />
      <span className="font-mono text-[10px] text-[var(--color-muted)]">{label}</span>
    </div>
  );
}
