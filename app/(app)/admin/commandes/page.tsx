"use client";

import { useState } from "react";
import Link from "next/link";
import { BAR_ORDERS, type BarOrderStatus } from "@/lib/mock";

const STATUS_FLOW: BarOrderStatus[] = ["reçue", "en préparation", "prête", "récupérée"];

const STATUS_STYLE: Record<BarOrderStatus, { bg: string; color: string; border: string }> = {
  "reçue":          { bg: "rgba(52,152,219,0.1)",  color: "#3498db", border: "rgba(52,152,219,0.3)" },
  "en préparation": { bg: "rgba(255,138,60,0.1)",  color: "#ff8a3c", border: "rgba(255,138,60,0.3)" },
  "prête":          { bg: "rgba(214,255,62,0.1)",  color: "#d6ff3e", border: "rgba(214,255,62,0.3)" },
  "récupérée":      { bg: "rgba(255,255,255,0.05)",color: "#8b91a5", border: "rgba(255,255,255,0.1)" },
};

function euros(n: number) {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState(BAR_ORDERS);
  const [filter, setFilter] = useState<"toutes" | BarOrderStatus>("toutes");

  function nextStatus(id: string) {
    setOrders(list => list.map(o => {
      if (o.id !== id) return o;
      const idx = STATUS_FLOW.indexOf(o.status);
      const next = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
      return { ...o, status: next };
    }));
  }

  const visible = filter === "toutes" ? orders : orders.filter(o => o.status === filter);
  const counts = STATUS_FLOW.reduce<Record<string, number>>((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});
  const totalToday = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
      <Link href="/admin" className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-lime)]">
        ← Admin
      </Link>

      <div className="mt-4 mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-2">
            Commandes au bar · QR table
          </div>
          <h1 className="font-display text-5xl lg:text-7xl">
            Commandes <span className="text-[var(--color-lime)]">en direct</span>
          </h1>
          <p className="text-[var(--color-cream-dim)] mt-2 max-w-xl">
            Suis les commandes passées depuis les tables (QR code), mets-les à jour au fil de leur préparation,
            et préviens les clients quand c'est prêt à récupérer.
          </p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard value={orders.length} label="Commandes aujourd'hui" color="#3498db" />
        <KpiCard value={counts["en préparation"] ?? 0} label="En préparation" color="#ff8a3c" />
        <KpiCard value={counts["prête"] ?? 0} label="Prêtes à récupérer" color="#d6ff3e" />
        <KpiCard value={`${totalToday.toFixed(2).replace(".", ",")} €`} label="CA bar (commandes table)" color="#27ae60" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {(["toutes", ...STATUS_FLOW] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 font-mono text-[11px] uppercase tracking-widest px-4 py-2.5 rounded-full border transition-all ${
              filter === s
                ? "border-[var(--color-lime)] text-[var(--color-lime)] bg-[var(--color-lime)]/5"
                : "border-white/10 text-[var(--color-muted)] hover:border-white/30"
            }`}
          >
            {s} {s !== "toutes" && <span className="opacity-50">· {counts[s] ?? 0}</span>}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {visible.map(order => {
          const style = STATUS_STYLE[order.status];
          const idx = STATUS_FLOW.indexOf(order.status);
          const isFinal = idx === STATUS_FLOW.length - 1;
          return (
            <div key={order.id} className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-5 lg:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 grid place-items-center font-display text-lg shrink-0">
                    {order.tableLabel.replace("Table ", "T")}
                  </div>
                  <div>
                    <div className="font-display text-2xl">{order.tableLabel}</div>
                    <div className="font-mono text-[11px] text-[var(--color-muted)]">
                      {order.id} · passée à {order.placedAt} · {order.paymentMethod}
                    </div>
                  </div>
                </div>
                <span
                  className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border whitespace-nowrap"
                  style={{ background: style.bg, color: style.color, borderColor: style.border }}
                >
                  {order.status}
                </span>
              </div>

              <div className="divide-y divide-white/5 mb-4">
                {order.lines.map((l, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-[var(--color-cream-dim)]">{l.qty} × {l.name}</span>
                    <span className="font-mono text-xs text-[var(--color-muted)]">{euros(l.price * l.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
                  Total · <span className="text-[var(--color-lime)] text-sm">{euros(order.total)}</span>
                </div>
                {!isFinal ? (
                  <button
                    onClick={() => nextStatus(order.id)}
                    className="btn-lime px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-widest"
                  >
                    Marquer « {STATUS_FLOW[idx + 1]} » →
                  </button>
                ) : (
                  <span className="font-mono text-[11px] text-[var(--color-muted)]">Commande terminée ✓</span>
                )}
              </div>
            </div>
          );
        })}

        {visible.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] p-10 text-center text-[var(--color-muted)] text-sm">
            Aucune commande dans ce statut pour l'instant.
          </div>
        )}
      </div>

      {/* Note d'implémentation */}
      <div className="mt-10 rounded-3xl border border-dashed border-[var(--color-lime)]/25 bg-[var(--color-lime)]/[0.03] p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-lime)] mb-2">À brancher en prod</div>
        <p className="text-sm text-[var(--color-cream-dim)] max-w-3xl leading-relaxed">
          Cette vue est alimentée par des données de démo. En production, chaque commande créée depuis l'écran
          <code className="mx-1 font-mono text-xs text-[var(--color-lime)]">/commander/[table]</code>
          arriverait ici en direct (websocket ou rafraîchissement périodique), et le paiement serait validé via le
          module e-commerce de la banque du bar avant que la commande ne parte en préparation.
        </p>
      </div>
    </div>
  );
}

function KpiCard({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-5 relative overflow-hidden">
      <span className="absolute top-0 left-0 right-0 h-1" style={{ background: color }} />
      <div className="font-display text-4xl lg:text-5xl mt-1" style={{ color }}>{value}</div>
      <div className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted)] mt-2">{label}</div>
    </div>
  );
}
