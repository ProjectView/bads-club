"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-context";
import { notifications } from "@/lib/notifications/dispatcher";
import type { NotificationEnvelope } from "@/lib/notifications/events";

const TYPE_LABEL: Record<string, string> = {
  "booking.confirmed": "Réservation confirmée",
  "booking.cancelled": "Réservation annulée",
  "booking.reminder_30min": "Rappel · ta partie commence bientôt",
  "waitlist.slot_available": "Un créneau s'est libéré !",
  "admin.booking_created": "Nouvelle réservation",
  "admin.booking_cancelled": "Annulation",
};

export function NotifBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationEnvelope[]>([]);
  const [unread, setUnread] = useState(0);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!user) { setItems([]); setUnread(0); return; }
    let cancelled = false;
    const load = async () => {
      const list = isAdmin
        ? await notifications.listForAdmins(20)
        : await notifications.listForRecipient(user.uid, 20);
      const u = isAdmin
        ? await notifications.unreadCountForAdmins()
        : await notifications.unreadCountForRecipient(user.uid);
      if (!cancelled) { setItems(list); setUnread(u); }
    };
    load();
    const t = setInterval(load, 4000);
    return () => { cancelled = true; clearInterval(t); };
  }, [user, isAdmin]);

  if (!user) return null;

  function onOpen() {
    setOpen(o => !o);
    if (!open) {
      // Mark all visible as read on opening
      items.forEach(it => notifications.markRead(it.id));
      setUnread(0);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={onOpen}
        className="relative w-9 h-9 rounded-full border border-white/10 hover:border-[var(--color-lime)] grid place-items-center transition"
        aria-label="Notifications"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-amber)] text-[var(--color-ink)] text-[10px] font-bold grid place-items-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[400px] rounded-2xl border border-white/10 bg-[var(--color-ink-2)] shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="font-display text-xl">Notifications</div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
              {isAdmin ? "feed admin" : "tes notifs"}
            </span>
          </div>
          <div className="max-h-[480px] overflow-y-auto divide-y divide-white/5">
            {items.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-[var(--color-muted)]">
                Aucune notification pour l'instant.
              </div>
            )}
            {items.map(it => (
              <NotifRow key={it.id} env={it} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NotifRow({ env }: { env: NotificationEnvelope }) {
  const ageMs = Date.now() - new Date(env.occurredAt).getTime();
  const ago = ageMs < 60_000 ? "à l'instant" : ageMs < 3_600_000 ? `il y a ${Math.round(ageMs / 60_000)} min` : new Date(env.occurredAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const Icon = ICONS[env.type] ?? "•";

  const summary = summarize(env);

  return (
    <a href={env.links.primary ?? "#"} className="block px-4 py-3 hover:bg-white/[0.03]">
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none mt-0.5">{Icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{TYPE_LABEL[env.type] ?? env.type}</div>
          <div className="text-xs text-[var(--color-cream-dim)] mt-0.5 leading-snug">{summary}</div>
          <div className="font-mono text-[10px] text-[var(--color-muted)] mt-1">{ago}</div>
        </div>
      </div>
    </a>
  );
}

const ICONS: Record<string, string> = {
  "booking.confirmed": "✓",
  "booking.cancelled": "✗",
  "booking.reminder_30min": "⏰",
  "waitlist.slot_available": "🎯",
  "admin.booking_created": "→",
  "admin.booking_cancelled": "↩",
};

function summarize(env: NotificationEnvelope): string {
  const d = env.data as Record<string, unknown>;
  const b = d.booking as { sportLabel?: string; courtLabel?: string; startsAt?: string; zoneLabel?: string } | undefined;
  const s = d.slot as { sportLabel?: string; courtLabel?: string; startsAt?: string } | undefined;
  const r = d.recipient as { displayName?: string } | undefined;
  const by = d.bookedBy as { displayName?: string } | undefined;
  const cancelBy = d.cancelledBy as { displayName?: string } | undefined;
  const bk = b ?? s;
  const fmtDate = bk?.startsAt ? new Date(bk.startsAt).toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

  switch (env.type) {
    case "booking.confirmed":
      return `${bk?.sportLabel} ${bk?.courtLabel} · ${fmtDate}${b?.zoneLabel ? ` · Zone ${b.zoneLabel}` : ""}`;
    case "booking.cancelled":
      return `${bk?.sportLabel} ${bk?.courtLabel} · ${fmtDate} · remboursé ${((d.refundCents as number) ?? 0) / 100}€`;
    case "booking.reminder_30min":
      return `${bk?.sportLabel} ${bk?.courtLabel} · ${fmtDate}`;
    case "waitlist.slot_available":
      return `${bk?.sportLabel} ${bk?.courtLabel} · ${fmtDate} — confirme vite, place réservée pour toi`;
    case "admin.booking_created":
      return `${by?.displayName ?? "?"} → ${bk?.sportLabel} ${bk?.courtLabel} · ${fmtDate}`;
    case "admin.booking_cancelled":
      return `${cancelBy?.displayName ?? "?"} a annulé ${bk?.sportLabel} ${bk?.courtLabel} · ${fmtDate}`;
    default:
      return r?.displayName ?? "—";
  }
}
