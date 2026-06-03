import Link from "next/link";
import { Toc, type TocItem } from "./toc";
import { OfferCta } from "./cta";

const SECTIONS: TocItem[] = [
  { id: "intro", label: "L'offre en une page" },
  { id: "contexte", label: "Contexte & enjeux" },
  { id: "vision", label: "La solution proposée" },
  { id: "demo", label: "La démo en ligne" },
  { id: "comparatif", label: "Doinsport vs Bad's" },
  { id: "architecture", label: "Architecture technique" },
  { id: "planning", label: "Planning par phases" },
  { id: "tarification", label: "Tarification" },
  { id: "ip", label: "Propriété & code" },
  { id: "next", label: "Prochaines étapes" },
];

export default function OffrePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 court-lines opacity-30" />
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[var(--color-lime)] opacity-[0.06] blur-3xl" />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-32">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 lg:col-span-9">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-lime)] mb-6">
                Offre commerciale · Mai 2026
              </div>
              <h1 className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.9] tracking-[-0.02em]">
                Refonte digitale<br/>
                <em className="text-[var(--color-lime)]">Bad&apos;s Club.</em>
              </h1>
              <p className="mt-6 text-lg lg:text-xl text-[var(--color-cream-dim)] max-w-2xl leading-relaxed">
                Une application web et mobile sur mesure pour remplacer Doinsport
                et porter l&apos;identité Bad&apos;s : réservation, communauté,
                paiement, communication automatisée.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-3 lg:pb-2">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-2">
                Préparée par
              </div>
              <div className="font-display text-3xl">ProjectView</div>
              <div className="text-sm text-[var(--color-cream-dim)] mt-1">Bernard · Adelin</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mt-6 mb-2">
                Pour
              </div>
              <div className="font-display text-3xl">Bad&apos;s Club</div>
              <div className="text-sm text-[var(--color-cream-dim)] mt-1">Lyon 7ème · depuis 1999</div>
            </div>
          </div>

          {/* Key numbers strip */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            <KeyNumber k="3 000 €" l="Setup one-shot" sub="à la signature" />
            <KeyNumber k="500 €/mois" l="Hébergement & maintenance" sub="à partir du 2ème mois" />
            <KeyNumber k="10–11 sem." l="Mise en production" sub="du kick-off au go-live" />
            <KeyNumber k="100 %" l="Code à Bad's Club" sub="zéro dépendance prestataire" />
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-12 gap-12">
          <aside className="hidden lg:block col-span-3">
            <Toc items={SECTIONS} />
          </aside>

          <div className="col-span-12 lg:col-span-9 space-y-24">
            <Intro />
            <Contexte />
            <Vision />
            <DemoSection />
            <Comparatif />
            <Architecture />
            <Planning />
            <Tarification />
            <Ip />
            <Next />
          </div>
        </div>
      </div>

      <OfferCta />
    </div>
  );
}

function KeyNumber({ k, l, sub }: { k: string; l: string; sub: string }) {
  return (
    <div className="bg-[var(--color-ink)] p-6 lg:p-8">
      <div className="font-display text-3xl lg:text-5xl text-[var(--color-lime)]">{k}</div>
      <div className="mt-2 text-sm">{l}</div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mt-1">{sub}</div>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] mb-3">{eyebrow}</div>
      <h2 className="font-display text-4xl lg:text-6xl leading-[0.95] tracking-tight mb-8">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-lg leading-relaxed text-[var(--color-cream-dim)]">{children}</p>;
}

function Intro() {
  return (
    <Section id="intro" eyebrow="L'offre en une page" title={<>En résumé.</>}>
      <Lead>
        ProjectView propose au Bad&apos;s Club une refonte digitale complète qui remplace Doinsport
        par une application web et mobile sur mesure, branded Bad&apos;s, déployée en 10 à 11 semaines.
      </Lead>
      <div className="grid md:grid-cols-2 gap-4">
        <Highlight tone="lime" label="Ce qui change pour les adhérents">
          Réservation en quelques secondes, communauté avec groupes thématiques, app installable sur le téléphone, notifications push gratuites, paiement en 1 clic.
        </Highlight>
        <Highlight tone="amber" label="Ce qui change pour Bad's Club">
          Dashboard admin complet (résa, membres, articles), un seul article rédigé devient 3 posts Instagram/Facebook/LinkedIn publiés automatiquement, code propre 100% propriété du club.
        </Highlight>
      </div>
    </Section>
  );
}

function Contexte() {
  return (
    <Section id="contexte" eyebrow="Pourquoi ce projet" title={<>Le <em className="text-[var(--color-lime)]">contexte</em>.</>}>
      <Lead>
        Le Bad&apos;s Club est installé depuis 1999 dans le 7ème arrondissement de Lyon : 13 terrains
        (badminton, squash, pétanque), tennis de table, simulateur baseball, bar-restaurant lounge,
        plus de 420 adhérents actifs.
      </Lead>
      <Lead>
        La gestion des réservations et de la communication passe aujourd&apos;hui par Doinsport,
        outil mutualisé qui répond aux besoins de base mais ne porte ni l&apos;identité Bad&apos;s,
        ni les fonctionnalités différenciantes qu&apos;un club historique mérite : groupes thématiques,
        communication automatisée, expérience mobile native, marque cohérente.
      </Lead>
      <Lead>
        Cette offre propose de construire — avec Bad&apos;s Club et pour Bad&apos;s Club — une
        application web et mobile sur mesure, capable de remplacer Doinsport et d&apos;ouvrir de
        nouveaux leviers de fidélisation et de communication.
      </Lead>
    </Section>
  );
}

function Vision() {
  const pillars = [
    { n: "01", title: "Site vitrine modernisé", desc: "Identité Bad's assumée, en cohérence avec le sport-lounge et la marque historique." },
    { n: "02", title: "Réservation temps réel", desc: "Sur les 5 sports, avec planning live, paiement Stripe et anti-conflit garanti." },
    { n: "03", title: "Communauté d'adhérents", desc: "Groupes thématiques (double mixte du jeudi, squash after-work, etc.), chat intégré, sessions récurrentes." },
    { n: "04", title: "Paiement en ligne", desc: "Stripe natif, tarification par zones temporelles, gestion des remboursements automatique." },
    { n: "05", title: "Studio communication", desc: "Éditeur d'articles avec reformatage IA pour Instagram, Facebook et LinkedIn, publication programmée." },
  ];
  return (
    <Section id="vision" eyebrow="La solution proposée" title={<>5 piliers.</>}>
      <div className="space-y-3">
        {pillars.map(p => (
          <div key={p.n} className="grid grid-cols-12 gap-4 p-6 rounded-2xl border border-white/10 bg-[var(--color-ink-2)] lift">
            <div className="col-span-2 lg:col-span-1">
              <div className="font-mono text-2xl text-[var(--color-lime)]">{p.n}</div>
            </div>
            <div className="col-span-10 lg:col-span-11">
              <div className="font-display text-2xl">{p.title}</div>
              <div className="text-sm text-[var(--color-cream-dim)] mt-1">{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function DemoSection() {
  const screens = [
    { label: "Page d'accueil", desc: "Identité Bad's 100%, 5 sports, communauté", path: "/" },
    { label: "Réservation temps réel", desc: "Grille live, zones Rouge/Bleue/Verte, multi-créneaux", path: "/reservation" },
    { label: "Communauté & groupes", desc: "Chat temps réel, réservation collective", path: "/communaute" },
    { label: "Espace admin", desc: "Dashboard, résa du jour, démo notif live", path: "/admin" },
    { label: "Évènements payants", desc: "Olympiade, tournois, inscription en ligne", path: "/evenements" },
    { label: "Studio articles + IA", desc: "Un article → 3 posts réseaux automatisés", path: "/admin/articles" },
  ];

  return (
    <Section id="demo" eyebrow="Maquette en ligne" title={<>Une démo <em className="text-[var(--color-lime)]">cliquable</em>.</>}>
      <Lead>
        L&apos;offre n&apos;est pas un PDF figé : c&apos;est une maquette entièrement navigable.
        Tu peux cliquer dans tous les écrans, créer un compte, réserver un créneau, recevoir une
        notification, gérer un article côté admin. Tout fonctionne.
      </Lead>

      <div className="rounded-2xl border border-[var(--color-lime)]/30 bg-[var(--color-lime)]/5 p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-lime)] mb-1">Lien démo</div>
          <div className="font-display text-2xl">bads-club.vercel.app</div>
          <div className="text-xs text-[var(--color-cream-dim)] mt-1">
            Comptes test visibles dans le bandeau « Comptes test » en haut du site
          </div>
        </div>
        <Link href="/" className="btn-lime px-6 py-3 rounded-full text-sm font-medium">
          Ouvrir la démo →
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {screens.map(s => (
          <Link key={s.path} href={s.path}
            className="lift group block rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-5 hover:border-[var(--color-lime)]/40">
            <div className="font-display text-xl group-hover:text-[var(--color-lime)] transition-colors">{s.label}</div>
            <div className="text-xs text-[var(--color-cream-dim)] mt-1">{s.desc}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mt-3 flex items-center gap-2">
              <span>{s.path}</span>
              <span className="text-[var(--color-lime)] opacity-0 group-hover:opacity-100 transition">→</span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function Comparatif() {
  const rows: { critere: string; doinsport: string; bads: string }[] = [
    { critere: "Branding", doinsport: "Interface générique Doinsport · logo Bad's en surimpression", bads: "Identité Bad's 100% · typo, couleurs et ton de marque cohérents" },
    { critere: "Réservation terrain", doinsport: "Fonctionnelle · 5 sports · grille tarifaire par zone", bads: "Reprise complète · UX plus rapide · multi-créneaux · live multi-utilisateurs" },
    { critere: "Communauté / groupes", doinsport: "Module \"Matchs\" limité (pas de chat, pas de groupes thématiques)", bads: "Groupes thématiques · chat temps réel · récurrence automatique · réservation collective" },
    { critere: "Paiement", doinsport: "Carnets de séances pré-payés", bads: "Stripe pay-as-you-go + remboursement automatique sur annulation" },
    { critere: "Notifications", doinsport: "Email basique, pas de push", bads: "Push (PWA) + email + SMS Brevo · liste d'attente automatique sur annulation" },
    { critere: "Communication marketing", doinsport: "Aucun outil intégré", bads: "Studio article · IA reformate pour Instagram / Facebook / LinkedIn · publication programmée" },
    { critere: "App mobile", doinsport: "App store + web · double maintenance", bads: "PWA installable depuis le site · pas de store · notifications push natives" },
    { critere: "Évolutivité", doinsport: "Dépendant du roadmap Doinsport", bads: "Code propre à Bad's · évolutions à la demande" },
  ];
  return (
    <Section id="comparatif" eyebrow="Diagnostic et bénéfices" title={<>Doinsport <em className="text-[var(--color-muted)]">vs</em> solution Bad&apos;s.</>}>
      <Lead>
        L&apos;objectif n&apos;est pas de remplacer pour remplacer : c&apos;est d&apos;apporter de la
        valeur sur les fonctionnalités qui font la différence — marque, communauté, communication,
        expérience mobile.
      </Lead>
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-12 gap-px bg-white/10 text-sm">
          <Cell head className="col-span-3">Critère</Cell>
          <Cell head className="col-span-5">Doinsport (actuel)</Cell>
          <Cell head className="col-span-4 text-[var(--color-lime)]">App Bad&apos;s sur mesure</Cell>
          {rows.flatMap(r => [
            <Cell key={r.critere + "-c"} className="col-span-3 font-medium">{r.critere}</Cell>,
            <Cell key={r.critere + "-d"} className="col-span-5 text-[var(--color-cream-dim)]">{r.doinsport}</Cell>,
            <Cell key={r.critere + "-b"} className="col-span-4">{r.bads}</Cell>,
          ])}
        </div>
      </div>
    </Section>
  );
}

function Cell({ head, className, children }: { head?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={`bg-[var(--color-ink-2)] p-4 ${head ? "font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]" : ""} ${className ?? ""}`}>
      {children}
    </div>
  );
}

function Architecture() {
  const stack = [
    { name: "Firebase", role: "Auth · base temps réel (Firestore) · stockage · notifications push (FCM) · fonctions serveur", cost: "0 € jusqu'à 50k utilisateurs/mois" },
    { name: "Brevo", role: "Emails transactionnels + SMS via une seule API et un seul dashboard", cost: "0 € email jusqu'à 9 000/mois · SMS à 0,045 €/pièce" },
    { name: "Vercel", role: "Hébergement Next.js (front + API) · CDN mondial · preview à chaque déploiement", cost: "0 € Hobby · ~20 €/mois Pro selon usage" },
    { name: "Stripe", role: "Paiement CB, Apple Pay, Google Pay · remboursements automatiques", cost: "1,5 % + 0,25 € par transaction CB EU" },
    { name: "N8N", role: "Orchestration notifications · automatisation publication réseaux sociaux", cost: "0 € (instance ProjectView)" },
  ];
  return (
    <Section id="architecture" eyebrow="Choix techno et coûts services" title={<>L&apos;architecture <em className="text-[var(--color-lime)]">technique</em>.</>}>
      <Lead>
        L&apos;architecture proposée repose sur des services tiers reconnus, choisis pour leur fiabilité,
        leur intégration native entre eux et leur coût marginal. Total estimé : 5 à 25 €/mois en services.
      </Lead>
      <div className="space-y-2">
        {stack.map(s => (
          <div key={s.name} className="grid grid-cols-12 gap-4 p-5 rounded-xl border border-white/10 bg-[var(--color-ink-2)]">
            <div className="col-span-12 md:col-span-2 font-display text-2xl">{s.name}</div>
            <div className="col-span-12 md:col-span-7 text-sm text-[var(--color-cream-dim)]">{s.role}</div>
            <div className="col-span-12 md:col-span-3 text-sm font-mono text-[var(--color-lime)]">{s.cost}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-5">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-lime)] mb-2">Application progressive (PWA)</div>
        <p className="text-sm text-[var(--color-cream-dim)] leading-relaxed">
          L&apos;application est conçue comme une <strong className="text-[var(--color-cream)]">Progressive Web App</strong> :
          elle s&apos;installe en deux clics depuis le site sur n&apos;importe quel téléphone, fonctionne
          hors-ligne pour consulter ses réservations, et envoie des notifications push natives —
          sans passer par les stores Apple et Google, sans coût et sans maintenance applicative double.
        </p>
      </div>
    </Section>
  );
}

function Planning() {
  const phases = [
    { n: "Phase 1", title: "MVP en ligne", duration: "4–5 semaines", items: ["Site vitrine refondu", "Auth membre/admin", "Réservation temps réel + paiement Stripe", "Notifications email + push", "Espace membre + admin"] },
    { n: "Phase 2", title: "Communauté", duration: "3 semaines", items: ["Groupes thématiques", "Chat temps réel", "Récurrence des sessions", "File d'attente automatique", "Réservation collective"] },
    { n: "Phase 3", title: "Studio comm'", duration: "2 semaines", items: ["Éditeur d'articles", "Reformatage IA pour IG / FB / LinkedIn", "Publication automatique", "Journal public"] },
    { n: "Go-live", title: "Migration & bascule", duration: "1 semaine", items: ["Migration des données Doinsport", "Domaine custom", "Communication adhérents", "Formation admin", "Bascule en parallèle 1 semaine"] },
  ];
  return (
    <Section id="planning" eyebrow="3 phases · 10 à 11 semaines" title={<>Le <em className="text-[var(--color-lime)]">planning</em>.</>}>
      <Lead>
        Chaque phase est livrable indépendamment, validée en démo et acceptée par Bad&apos;s Club
        avant le passage à la suivante. Vous conservez la possibilité d&apos;arrêter le projet entre deux phases.
      </Lead>
      <div className="grid md:grid-cols-2 gap-4">
        {phases.map(p => (
          <div key={p.n} className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-6">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-lime)]">{p.n}</div>
                <div className="font-display text-2xl mt-1">{p.title}</div>
              </div>
              <div className="font-mono text-xs text-[var(--color-muted)]">{p.duration}</div>
            </div>
            <ul className="space-y-1 text-sm text-[var(--color-cream-dim)]">
              {p.items.map(item => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[var(--color-lime)]/30 bg-[var(--color-lime)]/5 p-5">
        <strong className="text-[var(--color-lime)]">Durée totale : 10 à 11 semaines</strong> entre la signature et la mise en production complète.
        Le MVP (phase 1) est utilisable et facturable dès la fin de la 5ème semaine.
      </div>
    </Section>
  );
}

function Tarification() {
  return (
    <Section id="tarification" eyebrow="Transparent et prévisible" title={<>La <em className="text-[var(--color-lime)]">tarification</em>.</>}>
      <Lead>
        Un modèle simple, lisible et durable : un coût unique de mise en service, puis un abonnement
        mensuel fixe couvrant l&apos;hébergement et la maintenance. Aucun frais caché.
      </Lead>

      <div className="grid md:grid-cols-2 gap-4">
        <PriceCard
          label="Setup initial"
          when="One-shot · payé à la signature"
          price="3 000 €"
          unit="HT"
          desc="Conception, développement, intégration, mise en ligne, formation, bascule depuis Doinsport, migration des adhérents."
        />
        <PriceCard
          label="Abonnement mensuel"
          when="À partir du 2ème mois post-livraison"
          price="500 €"
          unit="HT / mois"
          desc="Hébergement, maintenance corrective, mises à jour de sécurité, évolutions mineures (jusqu'à 4h/mois), support email sous 48h."
          accent
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-5 text-sm space-y-3">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)]">Coûts complémentaires</div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="font-medium">Services tiers (refacturés au coût réel)</div>
            <div className="text-[var(--color-cream-dim)] text-xs mt-1">
              Firebase gratuit jusqu&apos;à 50k utilisateurs · Brevo gratuit jusqu&apos;à 9 000 emails/mois · Stripe 1,5 % + 0,25 € par paiement · SMS Brevo 0,045 € pièce.
              <strong className="text-[var(--color-cream)] block mt-1">Estimé : 5 à 15 € HT/mois.</strong>
            </div>
          </div>
          <div>
            <div className="font-medium">Évolutions majeures</div>
            <div className="text-[var(--color-cream-dim)] text-xs mt-1">
              Nouveau module, refonte d&apos;un parcours, intégration tierce : devis sur demande
              sur la base d&apos;un taux journalier de 500 € HT.
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border-l-2 border-[var(--color-lime)] bg-[var(--color-lime)]/5 p-6">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-lime)] mb-2">Économie attendue</div>
        <p className="text-sm leading-relaxed">
          En remplaçant Doinsport, Bad&apos;s Club récupère le <strong>contrôle total</strong> de
          sa relation client, de sa marque et de sa donnée — sans pénalité financière puisque l&apos;abonnement
          mensuel de 500 € HT couvre l&apos;ensemble des coûts récurrents (hors transactions Stripe et SMS marginaux).
        </p>
      </div>
    </Section>
  );
}

function PriceCard({ label, when, price, unit, desc, accent }: { label: string; when: string; price: string; unit: string; desc: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-6 ${accent ? "border-[var(--color-lime)]/40 bg-[var(--color-lime)]/5" : "border-white/10 bg-[var(--color-ink-2)]"}`}>
      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-1">{when}</div>
      <div className="font-medium text-lg mb-4">{label}</div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className={`font-display text-6xl ${accent ? "text-[var(--color-lime)]" : "text-[var(--color-cream)]"}`}>{price}</span>
        <span className="font-mono text-xs text-[var(--color-muted)]">{unit}</span>
      </div>
      <p className="text-sm text-[var(--color-cream-dim)] leading-relaxed">{desc}</p>
    </div>
  );
}

function Ip() {
  const rows = [
    ["Code source applicatif", "Bad's Club", "Dépôt Git transféré · licence d'exploitation perpétuelle"],
    ["Design, maquettes, identité visuelle dédiée", "Bad's Club", "Cession totale des droits patrimoniaux au règlement final"],
    ["Comptes services tiers (Firebase, Brevo, Stripe, domaine)", "Bad's Club", "Créés au nom de Bad's, ProjectView intervient en administrateur délégué"],
    ["Données utilisateurs et données métier", "Bad's Club", "Responsable de traitement RGPD · export libre à tout moment"],
    ["Templates email / SMS / posts réseaux", "Bad's Club", "Modifiables librement par le client après livraison"],
  ];
  return (
    <Section id="ip" eyebrow="Le client est propriétaire" title={<>Propriété <em className="text-[var(--color-lime)]">intellectuelle</em>.</>}>
      <Lead>
        Bad&apos;s Club est intégralement propriétaire de la solution livrée : code, design, données,
        comptes des services tiers. ProjectView ne conserve aucune dépendance bloquante.
      </Lead>
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-12 gap-px bg-white/10 text-sm">
          <Cell head className="col-span-5">Élément</Cell>
          <Cell head className="col-span-3">Propriétaire</Cell>
          <Cell head className="col-span-4">Conditions</Cell>
          {rows.flatMap(([elem, owner, conditions]) => [
            <Cell key={`${elem}-e`} className="col-span-5">{elem}</Cell>,
            <Cell key={`${elem}-o`} className="col-span-3 text-[var(--color-lime)] font-medium">{owner}</Cell>,
            <Cell key={`${elem}-c`} className="col-span-4 text-[var(--color-cream-dim)]">{conditions}</Cell>,
          ])}
        </div>
      </div>
      <p className="text-sm text-[var(--color-cream-dim)]">
        <strong className="text-[var(--color-cream)]">En clair :</strong> si Bad&apos;s Club décide à terme
        de changer de prestataire, vous partez avec le code, la donnée et les comptes services.
        Aucune relocation, aucune renégociation, aucun verrouillage commercial.
      </p>
    </Section>
  );
}

function Next() {
  const steps = [
    { n: "01", title: "Validation de l'offre", desc: "Retour de Bad's Club sur cette proposition — signature ou demande d'ajustements." },
    { n: "02", title: "Création des comptes services", desc: "Bad's Club crée les comptes Firebase, Brevo et Stripe (ProjectView assiste). Délais incompressibles : KYC Stripe 1–3 jours et Sender ID SMS Brevo 24–48h." },
    { n: "03", title: "Kick-off projet", desc: "Réunion de lancement, finalisation des derniers points : tarifs Tennis de table et Baseball, choix du sous-domaine, export Doinsport, désignation des administrateurs." },
    { n: "04", title: "Démarrage Phase 1", desc: "Wiring Firebase, intégration Stripe, mise en place des notifications. Démo intermédiaire à mi-parcours." },
    { n: "05", title: "Mise en production", desc: "Bascule en parallèle de Doinsport pendant une semaine, communication adhérents, formation des admins, puis arrêt de Doinsport." },
  ];
  return (
    <Section id="next" eyebrow="Prochaines étapes" title={<>Et <em className="text-[var(--color-lime)]">après</em> ?</>}>
      <div className="space-y-3">
        {steps.map(s => (
          <div key={s.n} className="grid grid-cols-12 gap-4 py-5 border-t border-white/10 last:border-b">
            <div className="col-span-2 lg:col-span-1">
              <div className="font-display text-3xl text-[var(--color-lime)]">{s.n}</div>
            </div>
            <div className="col-span-10 lg:col-span-11">
              <div className="font-display text-2xl">{s.title}</div>
              <div className="text-sm text-[var(--color-cream-dim)] mt-1 leading-relaxed">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-[var(--color-ink-2)] to-[var(--color-ink-3)] p-8 relative overflow-hidden">
        <div className="absolute inset-0 court-lines opacity-30" />
        <div className="relative">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-lime)] mb-3">On y va ?</div>
          <h3 className="font-display text-3xl lg:text-5xl tracking-tight">
            Prêts à <em className="text-[var(--color-lime)]">remplacer Doinsport</em>.
          </h3>
          <p className="text-[var(--color-cream-dim)] mt-3 max-w-xl">
            Si l&apos;offre vous convient, un mail suffit pour démarrer. On vous prépare ensuite
            le bon de commande et les accès aux services tiers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:bernard@projectview.fr?subject=Validation%20de%20l'offre%20Bad's%20Club%20%C3%97%20ProjectView&body=Bonjour%20Bernard%2C%0A%0AOn%20valide%20l'offre%20telle%20que%20pr%C3%A9sent%C3%A9e.%20Quelle%20est%20la%20suite%20concr%C3%A8te%20%3F%0A%0A%E2%80%94%20Bad's%20Club"
              className="btn-lime px-7 py-3.5 rounded-full font-medium"
            >
              Valider par email →
            </a>
            <a href="tel:0472715050" className="btn-ghost px-7 py-3.5 rounded-full font-medium">
              En parler de vive voix
            </a>
          </div>
          <div className="font-mono text-[10px] text-[var(--color-muted)] mt-6">
            Proposition valable 30 jours · Tous montants HT · Conditions générales disponibles sur demande
          </div>
        </div>
      </div>
    </Section>
  );
}

function Highlight({ tone, label, children }: { tone: "lime" | "amber"; label: string; children: React.ReactNode }) {
  const accent = tone === "lime" ? "var(--color-lime)" : "var(--color-amber)";
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-5 relative overflow-hidden">
      <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: accent }} />
      <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: accent }}>{label}</div>
      <p className="text-sm leading-relaxed text-[var(--color-cream-dim)]">{children}</p>
    </div>
  );
}
