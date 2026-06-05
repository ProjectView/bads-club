"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";

/**
 * Bandeau "mode démo" affiché en permanence en haut du site.
 *
 * - Visible pour tout le monde (logué ou non)
 * - Dismiss persistant via localStorage (pour le pitch en présentation : on peut le cacher)
 * - Au clic sur le bouton "Comptes test", ouvre un modal listant les credentials de démo
 */

const DISMISS_KEY = "bads.demo-banner.dismissed";

export function DemoBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (dismissed) return null;

  return (
    <>
      <div className="relative bg-gradient-to-r from-[var(--color-amber)]/15 via-[var(--color-lime)]/10 to-[var(--color-amber)]/15 border-b border-[var(--color-lime)]/30">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-2 flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-lime)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime)] pulse-dot" />
            Maquette · ProjectView × Bad&apos;s Club
          </span>
          <span className="text-xs text-[var(--color-cream-dim)] hidden sm:inline">
            Tu peux cliquer partout, c&apos;est une démo entièrement navigable.
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="text-xs px-3 py-1 rounded-full border border-[var(--color-lime)]/40 hover:border-[var(--color-lime)] text-[var(--color-lime)] transition-colors"
            >
              Comptes test →
            </button>
            <button
              onClick={() => { localStorage.setItem(DISMISS_KEY, "1"); setDismissed(true); }}
              aria-label="Fermer le bandeau démo"
              className="text-[var(--color-muted)] hover:text-[var(--color-cream)] w-5 h-5 grid place-items-center"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2 L8 8 M8 2 L2 8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && <DemoModal onClose={() => setOpen(false)} currentUser={user} />}
    </>
  );
}

function DemoModal({ onClose, currentUser }: { onClose: () => void; currentUser: { displayName: string; role: string } | null }) {
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-ink-2)] border border-white/10 rounded-3xl max-w-[640px] w-full p-6 lg:p-8 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-lime)] mb-2">
              Pour explorer la maquette
            </div>
            <h2 className="font-display text-3xl tracking-tight">Deux comptes de démo</h2>
          </div>
          <button onClick={onClose} aria-label="Fermer"
            className="w-8 h-8 rounded-full border border-white/10 hover:border-white/30 grid place-items-center text-[var(--color-muted)] hover:text-[var(--color-cream)] transition">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3 L9 9 M9 3 L3 9"/>
            </svg>
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <DemoAccount
            role="Membre"
            name="Léa Martin"
            email="lea@example.com"
            password="demo"
            description="Comme un adhérent classique : réserve un créneau, rejoint un groupe, voit ses notifs."
            current={currentUser?.displayName === "Léa Martin"}
          />
          <DemoAccount
            role="Admin"
            name="Caroline · Admin"
            email="admin@badsclub.com"
            password="admin"
            description="Voit toutes les réservations, gère les articles avec reformatage IA, monitore le feed notifications."
            current={currentUser?.role === "admin"}
          />
        </div>

        <div className="border-t border-white/10 pt-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-3">
            Scénario suggéré (5 min)
          </div>
          <ol className="space-y-2 text-sm text-[var(--color-cream-dim)]">
            <Step n={1}>
              Connecte-toi en <b className="text-[var(--color-cream)]">membre Léa</b> · réserve un créneau Badminton vert ou bleu.
            </Step>
            <Step n={2}>
              Visite <Link href="/communaute/double-mixte-jeudi" className="text-[var(--color-lime)] underline">un groupe</Link> et regarde le chat + réservation collective.
            </Step>
            <Step n={3}>
              Active les <b className="text-[var(--color-cream)]">notifications push</b> dans <Link href="/mon-compte" className="text-[var(--color-lime)] underline">Mon compte</Link>.
            </Step>
            <Step n={4}>
              Déconnecte-toi, reconnecte-toi en <b className="text-[var(--color-cream)]">admin</b> et regarde le <Link href="/admin/notifications" className="text-[var(--color-lime)] underline">feed temps réel</Link>.
            </Step>
            <Step n={5}>
              Sur ton téléphone, ouvre le site et <b className="text-[var(--color-cream)]">installe la PWA</b> (« Sur l&apos;écran d&apos;accueil »).
            </Step>
          </ol>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/connexion" onClick={onClose} className="btn-lime px-5 py-2.5 rounded-full text-sm font-medium">
            Se connecter →
          </Link>
          <Link href="/reservation" onClick={onClose} className="btn-ghost px-5 py-2.5 rounded-full text-sm">
            Aller à la réservation
          </Link>
        </div>
      </div>
    </div>
  );
}

function DemoAccount({
  role, name, email, password, description, current,
}: {
  role: string; name: string; email: string; password: string; description: string; current?: boolean;
}) {
  const [copied, setCopied] = useState<"email" | "pwd" | null>(null);
  async function copy(text: string, what: "email" | "pwd") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  }
  return (
    <div className={`rounded-2xl border p-4 ${current ? "border-[var(--color-lime)]/50 bg-[var(--color-lime)]/5" : "border-white/10 bg-white/[0.02]"}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
            role === "Admin" ? "bg-[var(--color-amber)]/15 text-[var(--color-amber)]" : "bg-[var(--color-lime)]/15 text-[var(--color-lime)]"
          }`}>
            {role}
          </span>
          {current && <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-lime)]">· connecté</span>}
        </div>
        <span className="text-xs text-[var(--color-muted)]">{name}</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 mt-2">
        <button onClick={() => copy(email, "email")}
          className="flex items-center justify-between gap-2 bg-[var(--color-ink)] px-3 py-2 rounded-lg text-xs font-mono hover:bg-white/[0.05]">
          <span className="truncate">{email}</span>
          <span className="text-[var(--color-muted)] shrink-0">{copied === "email" ? "✓" : "📋"}</span>
        </button>
        <button onClick={() => copy(password, "pwd")}
          className="flex items-center justify-between gap-2 bg-[var(--color-ink)] px-3 py-2 rounded-lg text-xs font-mono hover:bg-white/[0.05]">
          <span>mdp : {password}</span>
          <span className="text-[var(--color-muted)] shrink-0">{copied === "pwd" ? "✓" : "📋"}</span>
        </button>
      </div>
      <p className="text-xs text-[var(--color-cream-dim)] mt-3 leading-snug">{description}</p>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-5 h-5 rounded-full bg-[var(--color-lime)] text-[var(--color-ink)] grid place-items-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
        {n}
      </span>
      <span className="leading-snug">{children}</span>
    </li>
  );
}
