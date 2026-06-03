"use client";

import { useEffect, useState } from "react";

/**
 * CTA fixe en bas de la page d'offre.
 * Apparaît au scroll dès que l'utilisateur a dépassé le hero.
 */
export function OfferCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-[var(--color-ink-2)]/95 backdrop-blur-md border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            <div className="hidden sm:flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Setup + Maintenance</span>
              <span className="font-display text-xl">
                <span className="text-[var(--color-lime)]">3 000 €</span>
                <span className="font-mono text-sm text-[var(--color-muted)]"> + </span>
                <span className="text-[var(--color-lime)]">500 €/mois</span>
              </span>
            </div>
            <div className="hidden md:block w-px h-10 bg-white/10" />
            <span className="text-xs text-[var(--color-cream-dim)] hidden md:inline">
              Validité 30 jours · Conditions sur demande
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <a
              href="#tarification"
              className="btn-ghost px-4 py-2 rounded-full text-sm hidden sm:inline-block"
            >
              Voir les détails
            </a>
            <a
              href="mailto:bernard@projectview.fr?subject=Validation%20de%20l'offre%20Bad's%20Club%20%C3%97%20ProjectView"
              className="btn-lime px-5 py-2.5 rounded-full text-sm font-medium"
            >
              Valider l&apos;offre →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
