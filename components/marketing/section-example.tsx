/**
 * Exemple de composant marketing — Adelin peut s'en inspirer ou le supprimer.
 *
 * Tout est paramétrable via props. Aucune logique métier, juste de la présentation.
 * Utilise les design tokens définis dans app/globals.css (var(--color-*)).
 */

import Link from "next/link";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  align?: "left" | "center";
};

export function SectionExample({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaHref = "#",
  align = "left",
}: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-32">
      <div className={`max-w-2xl ${alignClass}`}>
        {eyebrow && (
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-5xl lg:text-7xl tracking-tight leading-[0.95]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[var(--color-cream-dim)] mt-5 text-lg leading-relaxed">
            {subtitle}
          </p>
        )}
        {ctaLabel && (
          <Link
            href={ctaHref}
            className="btn-lime inline-block mt-8 px-7 py-3.5 rounded-full font-medium"
          >
            {ctaLabel} →
          </Link>
        )}
      </div>
    </section>
  );
}
