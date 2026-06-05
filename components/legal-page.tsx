import Link from "next/link";

export function LegalPage({
  eyebrow, title, lastUpdate, children,
}: {
  eyebrow: string;
  title: string;
  lastUpdate: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[860px] mx-auto px-6 lg:px-12 py-14">
      <Link href="/" className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-lime)]">
        ← Retour à l&apos;accueil
      </Link>
      <div className="mt-6 mb-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-2">{eyebrow}</div>
        <h1 className="font-display text-5xl tracking-tight">{title}</h1>
        <div className="font-mono text-xs text-[var(--color-muted)] mt-3">Dernière mise à jour : {lastUpdate}</div>
      </div>
      <div className="prose-bads">
        {children}
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 rounded-2xl border border-dashed border-white/15 p-5 font-mono text-xs text-[var(--color-muted)]">
        <div className="text-[10px] uppercase tracking-widest text-[var(--color-amber)] mb-2">Placeholder</div>
        Le texte ci-dessus est un placeholder à valider par le conseil juridique du Bad&apos;s Club avant la mise en production.
        Les mentions obligatoires (RGPD, droit à l&apos;effacement, conservation des données, contact DPO) seront finalisées en phase de pré-prod.
      </div>
    </div>
  );
}
