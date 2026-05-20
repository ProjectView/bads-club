import { LegalPage } from "@/components/legal-page";

export default function MentionsLegales() {
  return (
    <LegalPage eyebrow="Information légale" title="Mentions légales" lastUpdate="20 mai 2026">
      <Section title="Éditeur du site">
        <p><strong>Bad&apos;s Club</strong> — Sport &amp; Lounge</p>
        <p>43 rue Garibaldi · 69007 Lyon · France</p>
        <p>Téléphone : 04 72 71 50 50</p>
        <p>Email : contact@badsclub.com</p>
        <p>SIRET : à compléter · RCS Lyon : à compléter</p>
        <p>Directeur de la publication : à compléter</p>
      </Section>

      <Section title="Hébergement">
        <p><strong>Vercel Inc.</strong> — 440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
        <p>Données stockées dans la région Europe (Paris) sur Firebase (Google Cloud).</p>
      </Section>

      <Section title="Conception et développement">
        <p><strong>ProjectView</strong> — agence digitale lyonnaise</p>
        <p>Contact : bernard@projectview.fr</p>
      </Section>

      <Section title="Propriété intellectuelle">
        <p>L&apos;ensemble du contenu de ce site (textes, images, vidéos, code) est la propriété exclusive du Bad&apos;s Club. Toute reproduction sans autorisation écrite préalable est interdite.</p>
      </Section>

      <Section title="Crédits photos">
        <p>Photos du club : Bad&apos;s Club · Photos lifestyle : à créditer en pré-production.</p>
      </Section>
    </LegalPage>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-display text-2xl mb-3">{title}</h2>
      <div className="text-[var(--color-cream-dim)] space-y-2 leading-relaxed">{children}</div>
    </section>
  );
}
