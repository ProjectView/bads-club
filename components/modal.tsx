"use client";

import { useEffect } from "react";

/**
 * Modal in-app — remplace les window.confirm() / window.alert() natifs
 * (mauvaise UX, look browser, pas brandé).
 */

export function Modal({
  open, onClose, title, children, actions,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/60 backdrop-blur-sm animate-in" onClick={onClose}>
      <div
        className="bg-[var(--color-ink-2)] border border-white/10 rounded-3xl max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="font-display text-2xl leading-tight">{title}</div>
          <button onClick={onClose} aria-label="Fermer"
            className="w-8 h-8 rounded-full border border-white/10 hover:border-white/30 grid place-items-center text-[var(--color-muted)] hover:text-[var(--color-cream)] transition shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3 L9 9 M9 3 L3 9"/>
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 text-sm text-[var(--color-cream-dim)] leading-relaxed">
          {children}
        </div>
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-2 flex-wrap">
          {actions}
        </div>
      </div>
    </div>
  );
}
