"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notifications } from "@/lib/notifications/dispatcher";
import type { NotificationEnvelope } from "@/lib/notifications/events";

const TYPE_LABEL: Record<string, string> = {
  "booking.confirmed": "Résa confirmée (membre notifié)",
  "booking.cancelled": "Résa annulée (membre notifié)",
  "booking.reminder_30min": "Rappel 30 min envoyé",
  "waitlist.slot_available": "Créneau libéré → file d'attente notifiée",
  "admin.booking_created": "Nouvelle réservation",
  "admin.booking_cancelled": "Annulation",
};

const TYPE_COLOR: Record<string, string> = {
  "booking.confirmed": "#d6ff3e",
  "booking.cancelled": "#ff8a3c",
  "booking.reminder_30min": "#3498db",
  "waitlist.slot_available": "#27ae60",
  "admin.booking_created": "#d6ff3e",
  "admin.booking_cancelled": "#ff8a3c",
};

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<NotificationEnvelope[]>([]);
  const [filter, setFilter] = useState<"all" | "admin" | "member">("all");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // Vue admin : on agrège tout (admin events + member events) pour avoir une vision complète.
      const admin = await notifications.listForAdmins(100);
      // En complément, on récupère ce qui est en attente côté membres en interrogeant
      // chaque destinataire connu. Pour la maquette, on s'appuie sur le feed admin qui
      // contient les contreparties (admin.booking_created mirror booking.confirmed).
      if (!cancelled) setItems(admin);
    };
    load();
    const t = setInterval(load, 3000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  const filtered = items.filter(it => {
    if (filter === "all") return true;
    if (filter === "admin") return it.type.startsWith("admin.");
    return !it.type.startsWith("admin.");
  });

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
        <div>
          <Link href="/admin" className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-lime)]">
            ← Admin
          </Link>
          <h1 className="font-display text-5xl lg:text-6xl tracking-tight mt-2">
            Feed <em className="text-[var(--color-lime)]">notifications</em>
          </h1>
          <p className="text-[var(--color-cream-dim)] mt-2 max-w-2xl">
            Toutes les notifications envoyées via N8N — temps réel.
            Email / SMS / Slack sont déclenchés en aval, ici on voit l'événement source.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          {[
            { id: "all" as const, label: "Tout" },
            { id: "admin" as const, label: "Admin" },
            { id: "member" as const, label: "Membres" },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full border ${
                filter === f.id ? "border-[var(--color-lime)] text-[var(--color-lime)]" : "border-white/10 text-[var(--color-muted)]"
              }`}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { k: items.filter(i => i.type === "admin.booking_created").length, l: "résa aujourd'hui", c: "#d6ff3e" },
          { k: items.filter(i => i.type === "admin.booking_cancelled").length, l: "annulations", c: "#ff8a3c" },
          { k: items.filter(i => i.type === "waitlist.slot_available").length, l: "alertes file d'attente", c: "#27ae60" },
          { k: items.length, l: "événements totaux", c: "#3498db" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-5">
            <div className="font-display text-4xl" style={{ color: s.c }}>{s.k}</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted)] mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-display text-2xl">Stream temps réel</div>
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime)] pulse-dot" />
            polling 3s · {filtered.length} évents
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.length === 0 && (
            <div className="px-6 py-16 text-center text-sm text-[var(--color-muted)]">
              Aucun événement à afficher. Connecte-toi en membre et fais une résa pour voir le flux.
            </div>
          )}
          {filtered.map(it => (
            <details key={it.id} className="group">
              <summary className="px-6 py-4 cursor-pointer hover:bg-white/[0.02] flex items-start gap-4 list-none">
                <span className="w-2 h-2 rounded-full mt-2.5 shrink-0" style={{ background: TYPE_COLOR[it.type] ?? "#888" }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{TYPE_LABEL[it.type] ?? it.type}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] px-2 py-0.5 rounded-full border border-white/10">
                      {it.audience}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--color-muted)]">{it.type}</span>
                  </div>
                  <div className="text-xs text-[var(--color-cream-dim)] mt-1">
                    {summarize(it)}
                  </div>
                </div>
                <div className="font-mono text-[10px] text-[var(--color-muted)] shrink-0">
                  {new Date(it.occurredAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </div>
              </summary>
              <div className="px-6 pb-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-1">Payload envoyé à N8N</div>
                <pre className="text-[10px] font-mono bg-[var(--color-ink)] border border-white/10 rounded-lg p-3 overflow-x-auto text-[var(--color-cream-dim)]">
{JSON.stringify(it, null, 2)}
                </pre>
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-5 text-xs text-[var(--color-muted)] font-mono">
        <div className="text-[10px] uppercase tracking-widest text-[var(--color-lime)] mb-2">prod · à configurer</div>
        Variable d'env <code>N8N_NOTIF_WEBHOOK</code> sur Vercel ⇒ chaque <code>emit()</code> POST vers ce webhook.
        Le cron de rappel 30 min sera une Cloud Function Firebase (cf. <code>docs/notifications.md</code>).
      </div>
    </div>
  );
}

function summarize(env: NotificationEnvelope): string {
  const d = env.data as Record<string, unknown>;
  const b = (d.booking ?? d.slot) as { sportLabel?: string; courtLabel?: string; startsAt?: string } | undefined;
  const who = (d.bookedBy ?? d.cancelledBy ?? d.recipient) as { displayName?: string; email?: string } | undefined;
  const fmtDate = b?.startsAt ? new Date(b.startsAt).toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
  return `${who?.displayName ?? "—"} · ${b?.sportLabel ?? "?"} ${b?.courtLabel ?? "?"} · ${fmtDate}`;
}
