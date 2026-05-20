"use client";

import { useEffect, useState } from "react";

/**
 * Bandeau d'invitation à installer la PWA.
 *
 * - Chrome / Edge / Android : capture l'événement `beforeinstallprompt` et
 *   expose un bouton "Installer" qui déclenche la pop-up native.
 * - iOS Safari : n'expose pas `beforeinstallprompt`. On affiche un guide
 *   "Partager → Sur l'écran d'accueil" si Safari mobile non standalone.
 * - Si l'app est déjà installée (mode standalone), on cache tout.
 *
 * Dismiss persistant via localStorage pour ne pas harceler l'utilisateur.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "bads.install.dismissed";

export function InstallPrompt() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosGuide, setIosGuide] = useState(false);
  const [dismissed, setDismissed] = useState(true); // hidden by default until we know

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (localStorage.getItem(DISMISS_KEY) === "1") {
      setDismissed(true);
      return;
    }

    // Déjà installé : on n'affiche rien
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // Safari iOS exposes this on navigator
      ((navigator as unknown as { standalone?: boolean }).standalone === true);
    if (isStandalone) {
      setDismissed(true);
      return;
    }

    const ua = navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIos) {
      setIosGuide(true);
      setDismissed(false);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
      setDismissed(false);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function onDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  async function onInstall() {
    if (!evt) return;
    await evt.prompt();
    const choice = await evt.userChoice;
    if (choice.outcome === "accepted") onDismiss();
    setEvt(null);
  }

  if (dismissed) return null;
  if (!evt && !iosGuide) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-6 lg:bottom-6 lg:w-[380px] z-40 rounded-2xl border border-[var(--color-lime)]/40 bg-[var(--color-ink-2)] shadow-2xl p-4 backdrop-blur">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-lime)] grid place-items-center text-[var(--color-ink)] font-display text-2xl shrink-0">
          B
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-xl">Installer l&apos;app Bad&apos;s</div>
          <div className="text-xs text-[var(--color-cream-dim)] mt-0.5 leading-snug">
            Réserve plus vite, reçois les notifs push, accède hors-ligne à tes résa.
          </div>
          {iosGuide ? (
            <div className="mt-3 text-xs text-[var(--color-cream-dim)] flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-lime)]">iOS</span>
              <span>Appuie sur</span>
              <ShareIcon />
              <span>puis « Sur l&apos;écran d&apos;accueil ».</span>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <button onClick={onInstall} className="btn-lime px-4 py-2 rounded-full text-sm font-medium">
                Installer
              </button>
              <button onClick={onDismiss} className="text-xs text-[var(--color-muted)] hover:text-[var(--color-cream)] px-3">
                Plus tard
              </button>
            </div>
          )}
        </div>
        <button onClick={onDismiss} aria-label="Fermer"
          className="text-[var(--color-muted)] hover:text-[var(--color-cream)] -mt-1 -mr-1 p-1">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3 L11 11 M11 3 L3 11"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <polyline points="16 6 12 2 8 6"/>
      <line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  );
}
