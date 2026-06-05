"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth-context";
import { notifications } from "@/lib/notifications/dispatcher";
import type { NotificationEnvelope } from "@/lib/notifications/events";
import s from "./AppNav.module.css";

const LINKS = [
  { href: "/reservation", label: "Réserver" },
  { href: "/evenements",  label: "Évènements" },
  { href: "/communaute",  label: "Communauté" },
  { href: "/tarifs",      label: "Tarifs" },
  { href: "/actualites",  label: "Actualités" },
];

const TYPE_LABEL: Record<string, string> = {
  "booking.confirmed":      "Réservation confirmée",
  "booking.cancelled":      "Réservation annulée",
  "booking.reminder_30min": "Rappel · ta partie commence bientôt",
  "waitlist.slot_available":"Un créneau s'est libéré !",
  "admin.booking_created":  "Nouvelle réservation",
  "admin.booking_cancelled":"Annulation",
};

const ICONS: Record<string, string> = {
  "booking.confirmed": "✓", "booking.cancelled": "✗",
  "booking.reminder_30min": "⏰", "waitlist.slot_available": "🎯",
  "admin.booking_created": "→", "admin.booking_cancelled": "↩",
};

export function AppNav() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [items, setItems] = useState<NotificationEnvelope[]>([]);
  const [unread, setUnread] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!user) { setItems([]); setUnread(0); return; }
    let cancelled = false;
    const load = async () => {
      const list = isAdmin ? await notifications.listForAdmins(20) : await notifications.listForRecipient(user.uid, 20);
      const u    = isAdmin ? await notifications.unreadCountForAdmins() : await notifications.unreadCountForRecipient(user.uid);
      if (!cancelled) { setItems(list); setUnread(u); }
    };
    load();
    const t = setInterval(load, 4000);
    return () => { cancelled = true; clearInterval(t); };
  }, [user, isAdmin]);

  // Close notif panel on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function openNotif() {
    setNotifOpen(o => !o);
    if (!notifOpen) { items.forEach(it => notifications.markRead(it.id)); setUnread(0); }
  }

  return (
    <header className={s.nav}>
      <div className={s.inner}>
        {/* Logo */}
        <Link href="/" className={s.logo} onClick={() => setOpen(false)}>
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" className={s.logoIcon}>
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M16 4L16 28M4 16L28 16M7 7L25 25M25 7L7 25" stroke="currentColor" strokeWidth="1" opacity=".5"/>
            <circle cx="16" cy="16" r="3" fill="currentColor"/>
          </svg>
          <span className={s.logoName}>Bad&apos;s</span>
          <span className={s.logoSub}>Sport · Lounge · Lyon</span>
        </Link>

        {/* Desktop links */}
        <nav className={s.links}>
          {LINKS.map(l => <Link key={l.href} href={l.href} className={s.link}>{l.label}</Link>)}
          {isAdmin && (
            <Link href="/admin" className={`${s.link} ${s.linkAdmin}`}>
              <span className={s.adminDot}/> Admin
            </Link>
          )}
        </nav>

        {/* Desktop right */}
        <div className={s.right}>
          {user && (
            <div style={{ position: "relative" }} ref={notifRef}>
              <button onClick={openNotif} className={s.bell} aria-label="Notifications">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unread > 0 && <span className={s.badge}>{unread}</span>}
              </button>
              {notifOpen && (
                <div className={s.notifPanel}>
                  <div className={s.notifHead}>
                    <span className={s.notifTitle}>Notifications</span>
                    <span className={s.notifSub}>{isAdmin ? "feed admin" : "tes notifs"}</span>
                  </div>
                  <div className={s.notifList}>
                    {items.length === 0
                      ? <div className={s.notifEmpty}>Aucune notification pour l'instant.</div>
                      : items.map(it => <NotifRow key={it.id} env={it}/>)
                    }
                  </div>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div style={{ width: "6rem", height: "2.2rem", borderRadius: "2rem", background: "rgba(255,255,255,.05)" }}/>
          ) : user ? (
            <Link href="/mon-compte" className={s.userBtn}>
              <span className={s.avatar}>{user.displayName.slice(0,1).toUpperCase()}</span>
              <span className={s.userName}>{user.displayName.split(" ")[0]}</span>
            </Link>
          ) : (
            <>
              <Link href="/connexion" className={s.btnLogin}>Connexion</Link>
              <Link href="/inscription" className={s.btnJoin}>Rejoindre →</Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className={s.mobileRight}>
          {user && (
            <div style={{ position: "relative" }} ref={notifRef}>
              <button onClick={openNotif} className={s.bell} aria-label="Notifications">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unread > 0 && <span className={s.badge}>{unread}</span>}
              </button>
            </div>
          )}
          <button onClick={() => setOpen(o => !o)} className={s.burger} aria-label="Menu">
            {open
              ? <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3L11 11M11 3L3 11"/></svg>
              : <svg width="15" height="12" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3H14M2 7H14M2 11H14"/></svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className={s.drawer}>
          {LINKS.map(l => <Link key={l.href} href={l.href} className={s.drawerLink} onClick={() => setOpen(false)}>{l.label}</Link>)}
          {isAdmin && <Link href="/admin" className={`${s.drawerLink}`} style={{ color: "var(--gold)" }} onClick={() => setOpen(false)}>Admin</Link>}
          <div className={s.drawerDivider}/>
          {user ? (
            <Link href="/mon-compte" className={s.drawerUser} onClick={() => setOpen(false)}>
              <span className={s.avatar}>{user.displayName.slice(0,1).toUpperCase()}</span>
              <span style={{ fontFamily: "var(--font-space-mono,monospace)", fontSize: "0.78rem" }}>{user.displayName}</span>
            </Link>
          ) : (
            <div className={s.drawerButtons}>
              <Link href="/connexion" className={s.drawerBtnSecondary} onClick={() => setOpen(false)}>Connexion</Link>
              <Link href="/inscription" className={s.drawerBtnPrimary} onClick={() => setOpen(false)}>Rejoindre →</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function NotifRow({ env }: { env: NotificationEnvelope }) {
  const ageMs = Date.now() - new Date(env.occurredAt).getTime();
  const ago = ageMs < 60_000 ? "à l'instant" : ageMs < 3_600_000 ? `il y a ${Math.round(ageMs / 60_000)} min` : new Date(env.occurredAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const d = env.data as Record<string, unknown>;
  const b = (d.booking ?? d.slot) as { sportLabel?: string; courtLabel?: string; startsAt?: string } | undefined;
  const by = (d.bookedBy ?? d.cancelledBy ?? d.recipient) as { displayName?: string } | undefined;
  const fmtDate = b?.startsAt ? new Date(b.startsAt).toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
  const summary = b ? `${b.sportLabel} ${b.courtLabel} · ${fmtDate}` : (by?.displayName ?? "");

  return (
    <a href={env.links.primary ?? "#"} className={s.notifRow}>
      <span className={s.notifIcon}>{ICONS[env.type] ?? "•"}</span>
      <div className={s.notifBody}>
        <div className={s.notifType}>{TYPE_LABEL[env.type] ?? env.type}</div>
        <div className={s.notifSummary}>{summary}</div>
        <div className={s.notifTime}>{ago}</div>
      </div>
    </a>
  );
}
