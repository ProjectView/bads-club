import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offre — Refonte digitale Bad's Club · ProjectView",
  description: "Proposition commerciale pour la refonte digitale du Bad's Club par ProjectView.",
  robots: { index: false, follow: false },
};

export default function OffreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="offre-shell">
      {/* Mini header sobre — pas la nav du site */}
      <header className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo />
            <span className="font-display text-xl leading-none">Bad&apos;s</span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)] mt-1">
              × ProjectView
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
              Réf. PV-BADS-2026-001 · Mai 2026
            </span>
            <Link href="/" className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-lime)]">
              ← Voir la démo
            </Link>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" className="text-[var(--color-lime)]">
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 4 L16 28 M4 16 L28 16 M7 7 L25 25 M25 7 L7 25" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
    </svg>
  );
}
