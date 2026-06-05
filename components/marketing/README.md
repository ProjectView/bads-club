# components/marketing/

Composants visuels réutilisables pour les pages publiques (site vitrine).

**Cette zone est à Adelin.** Tu peux y créer librement tes composants : hero, sections, témoignages, footer, cards…

## Conventions

- Un composant = un fichier `kebab-case.tsx`
- Export named (pas default) : `export function HeroPrimary() { … }`
- Pas de logique métier ici (pas d'appel à `lib/booking/*` ou `lib/auth.ts`)
- Si tu as besoin de données mock (témoignages, photos…), tu peux les hardcoder dans le composant ou créer un fichier `data.ts` à côté

## Suggestions de composants à créer

- `hero-primary.tsx` — Le hero de la homepage avec image/vidéo de fond
- `hero-secondary.tsx` — Hero plus simple pour pages internes
- `section-sports.tsx` — Section des 5 sports (badminton, squash, etc.)
- `section-lounge.tsx` — Section bar-restaurant
- `section-community.tsx` — Section communauté (utilise les vraies groupes mockées dans `lib/mock.ts`)
- `testimonials.tsx` — Avis adhérents
- `partners-strip.tsx` — Logos partenaires
- `cta-block.tsx` — Bloc d'appel à l'action réutilisable
- `event-teaser.tsx` — Card d'évènement pour la home

## Pattern recommandé

```tsx
// components/marketing/hero-primary.tsx
import Image from "next/image";
import Link from "next/link";

export function HeroPrimary() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/photos/club-interior.jpg"
        alt="Intérieur du Bad's Club"
        fill
        priority
        className="object-cover"
      />
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-32">
        <h1 className="font-display text-6xl lg:text-9xl leading-[0.9]">
          Ton titre
        </h1>
        <Link href="/reservation" className="btn-lime px-7 py-4 rounded-full mt-8 inline-block">
          Call to action
        </Link>
      </div>
    </section>
  );
}
```

Puis dans `app/page.tsx` :

```tsx
import { HeroPrimary } from "@/components/marketing/hero-primary";

export default function Home() {
  return (
    <>
      <HeroPrimary />
      {/* … */}
    </>
  );
}
```

## Design tokens disponibles

Toutes les variables CSS sont dans `app/globals.css`. Tu peux soit les utiliser telles quelles, soit les modifier.

```css
--color-ink: #0b0f1a;       /* fond principal (navy) */
--color-ink-2: #141a2b;     /* fond cartes */
--color-cream: #f4ede0;     /* texte principal */
--color-cream-dim: #e6ddc8; /* texte secondaire */
--color-lime: #d6ff3e;      /* accent principal */
--color-amber: #ff8a3c;     /* accent secondaire / alertes */
--color-muted: #8b91a5;     /* texte muet */

--font-display: "Instrument Serif", serif;   /* titres */
--font-body: "Geist", sans-serif;            /* corps */
--font-mono: "JetBrains Mono", monospace;    /* code, badges */
```

Si tu changes ces variables, **toutes les pages** (vitrine + back) prennent automatiquement les nouvelles couleurs. C'est ce qui garantit la cohérence visuelle entre site et app.
