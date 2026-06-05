"use client";

import { useState } from "react";
import Link from "next/link";
import { ADMIN_STATS, TODAY_BOOKINGS } from "@/lib/mock";
import { notifications } from "@/lib/notifications/dispatcher";

export default function AdminHubPage() {
  const [demoSent, setDemoSent] = useState(false);

  async function triggerDemoNotification() {
    const now = new Date();
    const startsAt = new Date(now.getTime() + 60 * 60_000); // dans 1h
    await notifications.emit({
      type: "admin.booking_created",
      audience: "admin",
      recipientId: null,
      data: {
        booking: {
          bookingId: `bkg_demo_${Date.now().toString().slice(-6)}`,
          courtId: "BAD-02",
          courtLabel: "Terrain 2",
          sportId: "badminton",
          sportLabel: "Badminton",
          zone: "blue",
          zoneLabel: "Bleue",
          startsAt: startsAt.toISOString(),
          endsAt: new Date(startsAt.getTime() + 60 * 60_000).toISOString(),
          priceCents: 1800,
        },
        bookedBy: {
          uid: "demo-user",
          displayName: "Camille Faure",
          email: "camille.faure@outlook.com",
          phone: "06 23 45 67 89",
        },
      },
      links: { primary: "/admin/notifications" },
    });
    setDemoSent(true);
    setTimeout(() => setDemoSent(false), 3000);
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-2">
            Espace admin · Bad&apos;s Studio
          </div>
          <h1 className="font-display text-5xl lg:text-7xl tracking-tight">
            Bonjour <em className="text-[var(--color-lime)]">Caroline.</em>
          </h1>
          <p className="text-[var(--color-cream-dim)] mt-2">
            Voici ce qui se passe au club aujourd&apos;hui · {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={triggerDemoNotification}
            className="btn-ghost px-4 py-2.5 rounded-full text-sm font-medium relative"
          >
            {demoSent ? "✓ Notif envoyée" : "▷ Démo notification"}
          </button>
          <Link href="/admin/articles" className="btn-lime px-5 py-2.5 rounded-full text-sm font-medium">
            + Nouvel article
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <StatCard k={ADMIN_STATS.bookingsToday}     l="résa aujourd'hui"     color="#d6ff3e" trend="+12% vs hier" />
        <StatCard k={ADMIN_STATS.bookingsThisWeek}  l="résa cette semaine"   color="#3498db" trend="+5% vs sem. dernière" />
        <StatCard k={`${ADMIN_STATS.occupancyRate}%`} l="taux d'occupation"  color="#ff8a3c" trend="objectif 75%" />
        <StatCard k={`${ADMIN_STATS.revenueThisMonth.toLocaleString("fr-FR")} €`} l="CA ce mois"  color="#27ae60" trend="+8% vs mois dernier" />
      </div>

      {/* Quick links grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <QuickCard
          href="/admin/reservations"
          title="Réservations"
          subtitle="Vue détaillée du planning, annulations, no-shows"
          k={ADMIN_STATS.bookingsToday}
          unit="aujourd'hui"
          icon="📅"
        />
        <QuickCard
          href="/admin/membres"
          title="Membres"
          subtitle="Liste, filtres, profils, abonnements"
          k={`+${ADMIN_STATS.newMembersThisMonth}`}
          unit="ce mois"
          icon="👥"
        />
        <QuickCard
          href="/admin/articles"
          title="Studio articles"
          subtitle="Rédige, reformate IA, publie sur les réseaux"
          k={ADMIN_STATS.pendingArticles}
          unit="en attente"
          icon="✍️"
          highlight={ADMIN_STATS.pendingArticles > 0}
        />
      </div>

      {/* Today's bookings */}
      <div className="rounded-3xl border border-white/10 bg-[var(--color-ink-2)] overflow-hidden mb-10">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="font-display text-2xl">Réservations du jour</div>
            <div className="text-xs font-mono text-[var(--color-muted)] mt-1">
              {TODAY_BOOKINGS.length} créneaux confirmés · {ADMIN_STATS.bookingsToday - TODAY_BOOKINGS.length} non listés
            </div>
          </div>
          <Link href="/admin/reservations" className="font-mono text-xs text-[var(--color-lime)] hover:underline">
            Tout voir →
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {TODAY_BOOKINGS.slice(0, 6).map(b => (
            <div key={b.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition">
              <div className="font-mono text-sm w-14 shrink-0 text-[var(--color-lime)]">{b.time}</div>
              <div className="font-mono text-xs text-[var(--color-muted)] w-20 shrink-0">{b.court}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{b.member}</div>
                <div className="text-xs font-mono text-[var(--color-muted)]">{b.sport} · {b.duration} min</div>
              </div>
              <StatusPill status={b.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Article quick link */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--color-ink-2)] to-[var(--color-ink-3)] p-8 lg:p-10 relative overflow-hidden">
        <div className="absolute inset-0 court-lines opacity-30" />
        <div className="relative grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 lg:col-span-8">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-lime)] mb-2">
              Studio article · Automatisation IA
            </div>
            <h2 className="font-display text-3xl lg:text-5xl tracking-tight">
              Un article. <em className="text-[var(--color-lime)]">Tous tes réseaux.</em>
            </h2>
            <p className="text-[var(--color-cream-dim)] mt-3 max-w-xl">
              Rédige une fois. L&apos;IA reformate pour Instagram, Facebook et LinkedIn. Programme la publication.
              Tu peux relire et ajuster avant envoi.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-2">
            <Link href="/admin/articles" className="btn-lime px-6 py-3 rounded-full text-center font-medium">
              Ouvrir le studio →
            </Link>
            <Link href="/admin/notifications" className="btn-ghost px-6 py-3 rounded-full text-center text-sm">
              Feed notifications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ k, l, color, trend }: { k: string | number; l: string; color: string; trend?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-5 relative overflow-hidden">
      <span className="absolute top-0 left-0 right-0 h-1" style={{ background: color }} />
      <div className="font-display text-4xl lg:text-5xl mt-1" style={{ color }}>{k}</div>
      <div className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted)] mt-2">{l}</div>
      {trend && <div className="text-[10px] font-mono text-[var(--color-cream-dim)] mt-1">{trend}</div>}
    </div>
  );
}

function QuickCard({
  href, title, subtitle, k, unit, icon, highlight,
}: { href: string; title: string; subtitle: string; k: string | number; unit: string; icon: string; highlight?: boolean }) {
  return (
    <Link href={href} className={`lift block rounded-3xl border p-6 transition-all ${
      highlight
        ? "border-[var(--color-amber)]/40 bg-[var(--color-amber)]/5 hover:border-[var(--color-amber)]"
        : "border-white/10 bg-[var(--color-ink-2)]"
    }`}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <div className="text-right">
          <div className="font-display text-3xl" style={{ color: highlight ? "var(--color-amber)" : "var(--color-lime)" }}>{k}</div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted)]">{unit}</div>
        </div>
      </div>
      <div className="font-display text-2xl">{title}</div>
      <div className="text-xs text-[var(--color-cream-dim)] mt-1">{subtitle}</div>
      <div className="mt-4 text-xs font-mono text-[var(--color-lime)]">Ouvrir →</div>
    </Link>
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
