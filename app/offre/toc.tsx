"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

/**
 * Table des matières sticky avec scroll-spy.
 * Suit la section actuellement visible et met à jour le lien actif.
 */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const nodes = items
      .map(it => document.getElementById(it.id))
      .filter((n): n is HTMLElement => !!n);

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    nodes.forEach(n => observer.observe(n));
    observers.push(observer);

    return () => observers.forEach(o => o.disconnect());
  }, [items]);

  return (
    <nav className="sticky top-20" aria-label="Sommaire de l'offre">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)] mb-4">
        Sommaire
      </div>
      <ol className="space-y-1.5 text-sm">
        {items.map((item, i) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`group flex items-baseline gap-3 py-1.5 transition-colors ${
                  isActive ? "text-[var(--color-lime)]" : "text-[var(--color-muted)] hover:text-[var(--color-cream)]"
                }`}
              >
                <span className={`font-mono text-[10px] tabular-nums shrink-0 transition-colors ${
                  isActive ? "text-[var(--color-lime)]" : "text-[var(--color-muted)]/60"
                }`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-tight">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
