"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-context";
import { summarizeNotif } from "@/lib/notifications/dispatcher";
import type { NotificationEnvelope, NotificationEventType } from "@/lib/notifications/events";

/**
 * Toasts in-app — écoutent les events du dispatcher et affichent une carte
 * bottom-right pendant ~5 sec. Aucune notification système (Notification API)
 * n'est utilisée — tout reste dans l'app, ce qui évite les demandes de permission
 * navigateur et fonctionne identiquement sur tous les contextes (PWA, browser).
 *
 * Le toast remplace `Notification` natif pour montrer les events au user pendant
 * qu'il est sur l'app. Pour les events qui arrivent hors-session (téléphone fermé),
 * c'est Cloud Functions Firebase + FCM qui prendra le relai en prod.
 */

const ICONS: Record<NotificationEventType, string> = {
  "booking.confirmed":       "✓",
  "booking.cancelled":       "↩",
  "booking.reminder_30min":  "⏰",
  "waitlist.slot_available": "★",
  "admin.booking_created":   "→",
  "admin.booking_cancelled": "↩",
};

const COLORS: Record<NotificationEventType, string> = {
  "booking.confirmed":       "var(--color-lime)",
  "booking.cancelled":       "var(--color-amber)",
  "booking.reminder_30min":  "#3498db",
  "waitlist.slot_available": "var(--color-lime)",
  "admin.booking_created":   "var(--color-lime)",
  "admin.booking_cancelled": "var(--color-amber)",
};

type ToastItem = NotificationEnvelope & { _id: number; visible: boolean };

let _seq = 0;

export function ToastHost() {
  const { user } = useAuth();
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems(prev => prev.map(it => it._id === id ? { ...it, visible: false } : it));
    // Remove from DOM after animation
    setTimeout(() => setItems(prev => prev.filter(it => it._id !== id)), 350);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onNotif = (e: Event) => {
      const env = (e as CustomEvent<NotificationEnvelope>).detail;
      if (!env || !user) return;
      const isForMe =
        (env.audience === "member" && env.recipientId === user.uid) ||
        (env.audience === "admin" && user.role === "admin");
      if (!isForMe) return;

      const id = ++_seq;
      const item: ToastItem = { ...env, _id: id, visible: true };
      setItems(prev => [item, ...prev].slice(0, 4));
      // Auto-dismiss after 5.5s
      setTimeout(() => dismiss(id), 5500);
    };
    window.addEventListener("bads-notification", onNotif as EventListener);
    return () => window.removeEventListener("bads-notification", onNotif as EventListener);
  }, [user, dismiss]);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 lg:top-24 lg:right-6 z-[55] flex flex-col gap-2 max-w-[360px] w-[calc(100vw-2rem)] lg:w-[360px] pointer-events-none">
      {items.map(item => (
        <Toast key={item._id} item={item} onClose={() => dismiss(item._id)} />
      ))}
    </div>
  );
}

function Toast({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const summary = summarizeNotif(item);
  const color = COLORS[item.type] ?? "var(--color-lime)";
  const icon = ICONS[item.type] ?? "•";

  return (
    <a
      href={item.links.primary ?? "#"}
      onClick={onClose}
      className={`pointer-events-auto bg-[var(--color-ink-2)] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur transition-all duration-300 ${
        item.visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      }`}
    >
      <div className="relative px-4 py-3.5 pl-12">
        <span className="absolute left-3.5 top-3.5 w-7 h-7 rounded-full grid place-items-center font-bold text-sm" style={{ background: color, color: "var(--color-ink)" }}>
          {icon}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
          aria-label="Fermer"
          className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-white/5 grid place-items-center text-[var(--color-muted)] hover:text-[var(--color-cream)] transition"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 2 L8 8 M8 2 L2 8" />
          </svg>
        </button>
        <div className="font-medium text-sm leading-snug pr-4">{summary.title}</div>
        <div className="text-xs text-[var(--color-cream-dim)] mt-0.5 leading-snug">{summary.body}</div>
      </div>
      <div className="h-0.5" style={{ background: color, animation: "toast-fade 5.5s linear" }} />
    </a>
  );
}
