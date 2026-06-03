import { LegalPage } from "@/components/legal-page";

export default function Confidentialite() {
  return (
    <LegalPage eyebrow="RGPD" title="Politique de confidentialité" lastUpdate="20 mai 2026">
      <Section title="Responsable de traitement">
        <p>Le Bad&apos;s Club est responsable du traitement de vos données personnelles. Vous pouvez nous contacter à dpo@badsclub.com.</p>
      </Section>

      <Section title="Données collectées">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Données d&apos;identification</strong> : nom, prénom, email, téléphone (optionnel)</li>
          <li><strong>Données d&apos;activité</strong> : réservations, paiements, participation à des groupes</li>
          <li><strong>Données techniques</strong> : adresse IP, type de navigateur, token de notification push</li>
        </ul>
      </Section>

      <Section title="Finalités">
        <p>Vos données sont utilisées pour gérer votre compte adhérent, vous permettre de réserver des créneaux, vous envoyer des confirmations et rappels, et vous adresser des communications du club si vous y avez consenti.</p>
        <p>Aucune donnée n&apos;est revendue à des tiers à des fins commerciales.</p>
      </Section>

      <Section title="Sous-traitants">
        <p>Vos données sont stockées et traitées chez les prestataires suivants :</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Firebase</strong> (Google) — authentification et base de données, région Europe</li>
          <li><strong>Brevo</strong> — envoi d&apos;emails et SMS transactionnels</li>
          <li><strong>Stripe</strong> — traitement des paiements (conforme PCI-DSS)</li>
          <li><strong>Netlify</strong> — hébergement de l&apos;application</li>
        </ul>
      </Section>

      <Section title="Durée de conservation">
        <p>Vos données sont conservées tant que votre compte est actif, puis archivées 3 ans après la dernière connexion à des fins comptables et légales, puis supprimées.</p>
      </Section>

      <Section title="Vos droits">
        <p>Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition et de portabilité sur vos données. Pour exercer ces droits, contactez dpo@badsclub.com.</p>
        <p>Vous pouvez également déposer une réclamation auprès de la CNIL (cnil.fr).</p>
      </Section>

      <Section title="Cookies">
        <p>Nous utilisons uniquement des cookies fonctionnels (session, préférences notifications) — aucun cookie de tracking publicitaire.</p>
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
