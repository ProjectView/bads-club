"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { NotifBell } from "@/components/notif-bell";

const LINKS = [
  { href: "/reservation", label: "Réserver" },
  { href: "/evenements", label: "Évènements" },
  { href: "/communaute", label: "Communauté" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/actualites", label: "Actualités" },
];

export function Nav() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[color:var(--color-ink)]/70 border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 group">
          <Logo />
          <span className="font-display text-2xl leading-none">Bad&apos;s</span>
          <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)] mt-1">
            Sport · Lounge · Lyon
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className="px-4 py-2 text-sm hover:text-[var(--color-lime)] transition-colors">
              {l.label}
            </Link>
          ))}

          {user?.role === "admin" && (
            <Link href="/admin"
              className="px-4 py-2 text-sm text-[var(--color-lime)] hover:opacity-80 transition flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime)]" />
              Admin
            </Link>
          )}

          {loading ? (
            <div className="ml-3 w-24 h-9 rounded-full bg-white/5 animate-pulse" />
          ) : user ? (
            <div className="ml-3 flex items-center gap-3">
              <NotifBell />
              <Link href="/mon-compte"
                className="pl-1 pr-4 py-1 rounded-full border border-white/10 hover:border-[var(--color-lime)] flex items-center gap-2 transition-colors">
                <span className="w-7 h-7 rounded-full bg-[var(--color-lime)] text-[var(--color-ink)] grid place-items-center font-bold text-xs">
                  {user.displayName.slice(0, 1).toUpperCase()}
                </span>
                <span className="text-sm">{user.displayName.split(" ")[0]}</span>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/connexion"
                className="ml-3 px-4 py-2 text-sm hover:text-[var(--color-lime)] transition-colors">
                Connexion
              </Link>
              <Link href="/inscription"
                className="btn-lime px-5 py-2 text-sm font-medium rounded-full">
                Rejoindre →
              </Link>
            </>
          )}
        </nav>

        {/* Mobile : bell + burger */}
        <div className="flex md:hidden items-center gap-2">
          {user && <NotifBell />}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
            aria-expanded={open}
            className="w-10 h-10 rounded-full border border-white/10 hover:border-[var(--color-lime)] grid place-items-center transition"
          >
            {open ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3 L11 11 M11 3 L3 11"/>
              </svg>
            ) : (
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3 H14 M2 7 H14 M2 11 H14"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[var(--color-ink)]">
          <nav className="px-6 py-4 flex flex-col gap-1">
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-white/5 hover:text-[var(--color-lime)] transition">
                {l.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link href="/admin" onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-[var(--color-lime)] hover:bg-[var(--color-lime)]/10 transition flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime)]" />
                Espace admin
              </Link>
            )}
            <div className="border-t border-white/10 my-2" />
            {user ? (
              <Link href="/mon-compte" onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-white/5 transition flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[var(--color-lime)] text-[var(--color-ink)] grid place-items-center font-bold text-sm">
                  {user.displayName.slice(0, 1).toUpperCase()}
                </span>
                <span>Mon compte · {user.displayName}</span>
              </Link>
            ) : (
              <div className="flex gap-2 px-4 py-2">
                <Link href="/connexion" onClick={() => setOpen(false)} className="flex-1 btn-ghost px-4 py-3 rounded-full text-sm text-center">
                  Connexion
                </Link>
                <Link href="/inscription" onClick={() => setOpen(false)} className="flex-1 btn-lime px-4 py-3 rounded-full text-sm text-center font-medium">
                  Rejoindre →
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-[var(--color-lime)]">
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 4 L16 28 M4 16 L28 16 M7 7 L25 25 M25 7 L7 25"
        stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
    </svg>
  );
}
