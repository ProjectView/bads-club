"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth-context";
import s from "./SiteNav.module.css";

const MOCK_NOTIFS = [
  { id: "1", icon: "🎾", type: "Réservation confirmée", summary: "Badminton · BAD—02 · Jeu. 22 mai 19h00", time: "Il y a 2 h" },
  { id: "2", icon: "👥", type: "Nouveau membre dans ton groupe", summary: "Marc R. a rejoint « Double mixte du jeudi »", time: "Hier" },
  { id: "3", icon: "🏆", type: "Tournoi à venir", summary: "Tournoi Open Badminton · Sam. 7 juin", time: "Il y a 3 j" },
];

export function SiteNav() {
  const { user, signOut, loading } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "admin";

  /* Close notif panel on outside click */
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  /* Close drawer on resize to desktop */
  useEffect(() => {
    function handle() { if (window.innerWidth >= 768) setDrawerOpen(false); }
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  const initial = user?.displayName?.[0]?.toUpperCase() ?? "?";
  const firstName = user?.displayName?.split(" ")[0] ?? "";

  /* ── Desktop links vary by auth state ── */
  const desktopLinks = user ? (
    <>
      <Link href="/reservation" className={s.link}>Réserver</Link>
      <Link href="/evenements" className={s.link}>Évènements</Link>
      <Link href="/communaute" className={s.link}>Communauté</Link>
      <Link href="/tarifs" className={s.link}>Tarifs</Link>
      {isAdmin && (
        <Link href="/admin" className={`${s.link} ${s.linkAdmin}`}>
          <span className={s.adminDot}/>Admin
        </Link>
      )}
    </>
  ) : (
    <>
      <Link href="/sport" className={s.link}>Sport</Link>
      <Link href="/bar" className={s.link}>Bar</Link>
      <Link href="/evenements" className={s.link}>Évènements</Link>
      <Link href="/tarifs" className={s.link}>Tarifs</Link>
    </>
  );

  /* ── Desktop right actions ── */
  const desktopRight = loading ? null : user ? (
    <>
      {/* Bell */}
      <div className={s.notifWrap} ref={notifRef}>
        <button
          className={s.bell}
          aria-label="Notifications"
          onClick={() => setNotifOpen(o => !o)}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {MOCK_NOTIFS.length > 0 && (
            <span className={s.bellBadge}>{MOCK_NOTIFS.length}</span>
          )}
        </button>

        {notifOpen && (
          <div className={s.notifPanel}>
            <div className={s.notifHead}>
              <div>
                <div className={s.notifTitle}>Notifications</div>
                <div className={s.notifSub}>{MOCK_NOTIFS.length} non lues</div>
              </div>
            </div>
            <div className={s.notifList}>
              {MOCK_NOTIFS.length === 0 ? (
                <p className={s.notifEmpty}>Aucune notification</p>
              ) : MOCK_NOTIFS.map(n => (
                <Link key={n.id} href="#" className={s.notifRow}>
                  <span className={s.notifIcon}>{n.icon}</span>
                  <div>
                    <div className={s.notifType}>{n.type}</div>
                    <div className={s.notifSummary}>{n.summary}</div>
                    <div className={s.notifTime}>{n.time}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <Link href="/mon-compte" className={s.profile}>
        <div className={s.avatar}>{initial}</div>
        <span className={s.profileName}>{firstName}</span>
      </Link>
    </>
  ) : (
    <>
      <Link href="/connexion" className={s.btnLogin}>Connexion</Link>
      <Link href="/inscription" className={s.btnJoin}>Rejoindre</Link>
    </>
  );

  /* ── Drawer links (mobile) ── */
  const drawerLinks = user ? (
    <>
      <Link href="/reservation" className={s.drawerLink} onClick={() => setDrawerOpen(false)}>Réserver</Link>
      <Link href="/evenements" className={s.drawerLink} onClick={() => setDrawerOpen(false)}>Évènements</Link>
      <Link href="/communaute" className={s.drawerLink} onClick={() => setDrawerOpen(false)}>Communauté</Link>
      <Link href="/tarifs" className={s.drawerLink} onClick={() => setDrawerOpen(false)}>Tarifs</Link>
      {isAdmin && <Link href="/admin" className={s.drawerLink} onClick={() => setDrawerOpen(false)}>Admin</Link>}
      <div className={s.drawerDivider}/>
      <Link href="/mon-compte" className={s.drawerProfile} onClick={() => setDrawerOpen(false)}>
        <div className={s.avatar}>{initial}</div>
        <span style={{ fontSize: "0.85rem" }}>{user.displayName}</span>
      </Link>
      <button
        className={s.drawerLink}
        style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", width: "100%" }}
        onClick={async () => { await signOut(); setDrawerOpen(false); }}
      >
        Déconnexion
      </button>
    </>
  ) : (
    <>
      <Link href="/sport" className={s.drawerLink} onClick={() => setDrawerOpen(false)}>Sport</Link>
      <Link href="/bar" className={s.drawerLink} onClick={() => setDrawerOpen(false)}>Bar</Link>
      <Link href="/evenements" className={s.drawerLink} onClick={() => setDrawerOpen(false)}>Évènements</Link>
      <Link href="/tarifs" className={s.drawerLink} onClick={() => setDrawerOpen(false)}>Tarifs</Link>
      <div className={s.drawerDivider}/>
      <div className={s.drawerButtons}>
        <Link href="/connexion" className={s.drawerBtnGhost} onClick={() => setDrawerOpen(false)}>Connexion</Link>
        <Link href="/inscription" className={s.drawerBtnGold} onClick={() => setDrawerOpen(false)}>Rejoindre</Link>
      </div>
    </>
  );

  return (
    <>
      <nav className={s.nav}>
        <div className={s.inner}>
          {/* Logo */}
          <Link href="/" className={s.logo}>
            <Image src="/logo-bads.png" alt="Bad's Club" width={36} height={33} priority />
            <div>
              <div className={s.logoName}>Bad&apos;s</div>
              <div className={s.logoSub}>Urban Sport &amp; Lounge</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className={s.links}>
            {desktopLinks}
          </div>

          {/* Desktop right */}
          <div className={s.right}>
            {desktopRight}
          </div>

          {/* Mobile right */}
          <div className={s.mobileRight}>
            {!loading && user && (
              <div className={s.notifWrap} ref={notifRef}>
                <button className={s.bell} onClick={() => setNotifOpen(o => !o)} aria-label="Notifications">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  {MOCK_NOTIFS.length > 0 && <span className={s.bellBadge}>{MOCK_NOTIFS.length}</span>}
                </button>
              </div>
            )}
            <button
              className={s.burger}
              aria-label={drawerOpen ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setDrawerOpen(o => !o)}
            >
              {drawerOpen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className={s.drawer}>
            {drawerLinks}
          </div>
        )}
      </nav>
    </>
  );
}
