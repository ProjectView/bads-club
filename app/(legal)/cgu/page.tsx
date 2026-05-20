import { LegalPage } from "@/components/legal-page";

export default function CGU() {
  return (
    <LegalPage eyebrow="Conditions générales" title="Conditions d'utilisation" lastUpdate="20 mai 2026">
      <Section title="1. Objet">
        <p>Les présentes conditions générales d&apos;utilisation (CGU) régissent l&apos;accès et l&apos;usage de l&apos;application web et mobile du Bad&apos;s Club par tout visiteur ou membre adhérent.</p>
      </Section>

      <Section title="2. Création de compte">
        <p>L&apos;inscription est gratuite et ouverte à toute personne majeure. Les informations renseignées doivent être exactes et tenues à jour.</p>
        <p>L&apos;utilisateur est responsable de la confidentialité de son mot de passe et de toutes les actions effectuées via son compte.</p>
      </Section>

      <Section title="3. Réservation de terrain">
        <p>Les réservations s&apos;effectuent exclusivement en ligne via l&apos;application. Le paiement est dû au moment de la réservation, par carte bancaire via Stripe.</p>
        <p><strong>Politique d&apos;annulation</strong> : conformément à la grille publique du club, une annulation effectuée avant 24h donne lieu à un remboursement intégral. Au-delà, le créneau est dû.</p>
      </Section>

      <Section title="4. Communauté et groupes">
        <p>Les membres peuvent créer ou rejoindre des groupes thématiques. Tout propos discriminatoire, injurieux ou contraire à la loi française est strictement prohibé. Le Bad&apos;s Club se réserve le droit de supprimer un groupe ou un compte en cas de manquement.</p>
      </Section>

      <Section title="5. Responsabilité">
        <p>Le Bad&apos;s Club met en œuvre les moyens raisonnables pour assurer la disponibilité du service, sans garantie absolue. La pratique sportive reste sous la responsabilité du joueur et nécessite une assurance civile à jour.</p>
      </Section>

      <Section title="6. Évolution des CGU">
        <p>Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs sont informés des changements par email.</p>
      </Section>

      <Section title="7. Droit applicable">
        <p>Les CGU sont régies par le droit français. En cas de litige, les tribunaux de Lyon sont seuls compétents.</p>
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
