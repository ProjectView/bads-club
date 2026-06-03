# Handoff — Bad's Club app

Document de passation entre **Bernard** (backend & infra) et **Adelin** (front & design).
Lis ce document en entier avant de commencer à coder.

---

## TL;DR pour Adelin

```bash
git clone <URL_DU_REPO> bads-club
cd bads-club
npm install
npm run dev          # http://localhost:3000
```

Login pour tester : `lea@example.com` / `demo` (membre) ou `admin@badsclub.com` / `admin` (admin).
Toute la maquette est navigable, les données sont mockées dans `lib/mock.ts` et `lib/booking/repository.ts`.

---

## Périmètre de chacun

Pour éviter de se marcher dessus, on découpe le repo en zones de responsabilité.

### ✅ Zone Adelin (front & design)

| Fichier / Dossier | Quoi y faire |
|---|---|
| `app/page.tsx` | Page d'accueil — refonte design, hero, sections sport-lounge, témoignages, etc. |
| `app/actualites/page.tsx` | Page actualités publique |
| `app/tarifs/page.tsx` | Page tarifs — design libre, **ne pas toucher** aux données importées de `lib/booking/config` |
| `app/evenements/page.tsx` | Liste évènements — design libre, **ne pas toucher** au bouton d'inscription (composant client) |
| `app/(legal)/*` | Mentions, CGU, Confidentialité — peut peaufiner copy & design |
| `app/globals.css` | Design system : couleurs, fonts, animations. Modifications libres. |
| `app/layout.tsx` | **Uniquement** le composant `Footer()` et les `metadata`. Ne pas toucher aux providers. |
| `components/nav.tsx` | Visuel de la nav (couleurs, logo, layout) — pas la logique d'auth |
| `components/install-prompt.tsx` | Look & wording du bandeau d'install PWA |
| `components/demo-banner.tsx` | Tu peux le supprimer/garder selon ce qu'on décide pour la prod |
| `public/*` | Toutes les images, fonts, icônes — libre |

### 🔒 Zone Bernard (back & infra) — ne pas toucher

| Fichier / Dossier | Pourquoi |
|---|---|
| `lib/booking/*` | Moteur de réservation, règles métier, repository |
| `lib/notifications/*` | Dispatcher events + N8N webhook |
| `lib/auth.ts` | Couche auth (mock → Firebase Auth en prod) |
| `app/api/*` | Routes serveur |
| `app/admin/*` | Espace admin (logique métier) |
| `app/reservation/page.tsx` | Flow de résa (hold + paiement) |
| `app/communaute/*` | Chat & groupes |
| `app/mon-compte/page.tsx` | Espace membre |
| `middleware.ts` | Protection des routes admin |
| `components/auth-context.tsx` | Provider d'auth |
| `components/auth-shell.tsx` | Layout des pages de login/inscription |
| `components/notif-bell.tsx`, `notif-preferences.tsx`, `toast-host.tsx`, `modal.tsx` | Composants liés aux notifs |
| `components/pwa-provider.tsx` | Enregistrement service worker |
| `public/sw.js`, `public/manifest.webmanifest` | PWA infra |

### 🤝 Zone partagée (à coordonner avant de pusher)

| Fichier | Notes |
|---|---|
| `components/nav.tsx` | Si Adelin veut changer la structure de la nav (ajouter/retirer des liens), prévenir Bernard |
| `app/layout.tsx` | Au-delà du footer et des metadata, prévenir |
| `package.json` | Toute nouvelle dépendance → prévenir |
| `tailwind.config.ts` / configs | Coordonner avant modif |
| `lib/mock.ts` | Adelin peut enrichir le contenu (articles, témoignages…), mais sans changer les types existants |

---

## Workflow Git

### Branches

- **`main`** : production · déployée sur **bads-club.netlify.app** · pas de push direct
- **`dev`** : branche d'intégration · merge des feature branches
- **`front/*`** : branches d'Adelin (ex. `front/home-redesign`, `front/footer-photos`)
- **`back/*`** : branches de Bernard (ex. `back/firebase-wiring`, `back/stripe-webhook`)

### Procédure pour Adelin

```bash
# Récupère les dernières modifs avant de commencer
git checkout dev
git pull

# Crée ta branche
git checkout -b front/home-redesign

# Travaille, commit régulièrement
git add app/page.tsx app/globals.css
git commit -m "front: nouveau hero homepage avec photos club"

# Push et ouvre une Pull Request
git push -u origin front/home-redesign
# → Netlify génère automatiquement une URL deploy preview
# → Bernard review la PR
# → Merge dans dev quand validé
```

### Procédure pour merger en production

Bernard merge `dev` → `main` une fois par semaine ou à la demande, après validation des features.

---

## Netlify & déploiements

Une fois le repo connecté à Netlify (cf. setup en bas) :

| Action | Résultat |
|---|---|
| Push sur `main` | Deploy **production** → bads-club.netlify.app |
| Push sur `dev` | Deploy preview stable → `deploy-preview-N--bads-club.netlify.app` |
| Open PR | Deploy preview unique → URL postée en commentaire du PR |

Adelin n'a **pas besoin** d'avoir un accès Netlify direct — il bosse sur Git, Netlify fait le reste.

---

## Conventions de commit

Format simple :
- `front: …` pour les modifs design/UI d'Adelin
- `back: …` pour le code métier de Bernard
- `chore: …` pour les configs, deps, CI
- `fix: …` pour les bugs
- `doc: …` pour la doc

Exemples :
```
front: hero homepage avec photos lounge
front: refonte footer + icones sociaux
back: wiring Firestore sur module booking
fix: confirmHold retournait hold_expired pour les créneaux > 8min futurs
chore: bump next 15.5.20
```

---

## Comptes & accès à demander

Pour qu'Adelin puisse bosser pleinement :

| Service | Demande à | Quoi |
|---|---|---|
| **GitHub** | Bernard | Invitation au repo en `Write` |
| **Netlify** | Bernard (optionnel) | Lecture du dashboard Netlify ProjectView pour voir les déploiements |
| **Figma / drive design** | Adelin lui-même | À mettre en place si besoin |
| **Photos / brand assets Bad's Club** | Le client | Recevoir photos club, charte si elle existe |

---

## Guide pratique : comment refondre une page

### Le principe

L'app actuelle a un design volontairement neutre. Adelin va y greffer la **vraie identité Bad's Club** : photos du club, typographies finalisées, ambiance lounge sportive, charte couleur définitive.

Trois niveaux d'intervention possibles, du plus simple au plus radical :

#### Niveau 1 — Ajuster les design tokens (1 min, impact partout)

Dans [`app/globals.css`](./app/globals.css), tu trouves les variables CSS qui pilotent toute l'app :

```css
--color-lime: #d6ff3e;       /* accent principal — change pour orange, bleu, rouge club… */
--color-ink: #0b0f1a;        /* fond — navy actuel, peut devenir noir, anthracite… */
--font-display: "Instrument Serif", serif;  /* titres — peut devenir Playfair, Tasa, etc. */
```

Tu changes une variable → **toutes les pages** (vitrine + résa + admin) prennent la nouvelle couleur. C'est ce qui garantit la cohérence entre la partie marketing et l'app fonctionnelle.

#### Niveau 2 — Refondre une page publique (1-3h par page)

Tu ouvres par exemple [`app/page.tsx`](./app/page.tsx) (homepage) et tu réécris le JSX/Tailwind. Tu peux :
- Remplacer des sections entières
- Importer tes nouveaux composants depuis [`components/marketing/`](./components/marketing/)
- Utiliser `next/image` pour des photos optimisées (sortie sous `public/photos/…`)
- Ajouter des animations CSS dans `globals.css` ou via Framer Motion (à installer si besoin, prévenir Bernard)

Les pages que tu peux refondre librement :

| Page | Fichier | Note |
|---|---|---|
| Homepage | `app/page.tsx` | C'est la priorité absolue |
| Tarifs | `app/tarifs/page.tsx` | Garde les données (zones Rouge/Bleue/Verte) qui viennent de `lib/booking/config` |
| Actualités (liste) | `app/actualites/page.tsx` | Les articles sont dans `lib/mock.ts`, tu peux en ajouter |
| Évènements (liste) | `app/evenements/page.tsx` | Les évènements sont dans `lib/mock.ts`, idem |
| Mentions, CGU, RGPD | `app/(legal)/*` | Layout libre via le composant `LegalPage` |
| Footer | `app/layout.tsx` (fonction `Footer`) | Peut tout refaire |

#### Niveau 3 — Site vitrine radicalement différent (si nécessaire)

Si tu veux un **design vitrine très différent** du design de l'app (par exemple un site très éditorial/magazine pour le marketing vs une app très fonctionnelle pour la résa), on peut isoler via les Next.js Route Groups :

```
app/
├── (marketing)/        ← TON terrain de jeu
│   ├── layout.tsx      ← layout marketing (nav simplifiée, ton propre footer)
│   ├── page.tsx        ← homepage
│   ├── tarifs/
│   ├── actualites/
│   └── evenements/
└── (app)/              ← le back de Bernard
    ├── layout.tsx      ← layout app avec nav complète, cloche notifs
    ├── reservation/
    ├── communaute/
    ├── mon-compte/
    └── admin/
```

C'est une réorganisation 30 min côté Bernard, fais-moi signe quand tu en auras besoin. Pour démarrer, garde la structure actuelle — la cohérence via les variables CSS suffit dans 90 % des cas.

---

## Workflow visuel (Figma → code)

Si Adelin travaille sur Figma (ou autre outil) avant de coder :

1. **Maquette Figma** validée avec le client (ou avec Bernard pour itération)
2. **Tu crées une branche** : `git checkout -b front/home-redesign`
3. **Tu codes section par section** :
   - Crée le composant dans `components/marketing/section-xxx.tsx`
   - Importe-le dans `app/page.tsx`
   - Vérifie sur localhost
4. **Tu pushes** → Netlify génère une URL deploy preview
5. **Tu partages l'URL au client** dans le commentaire de la PR
6. **Validation client** → merge dans `dev` puis `main`

L'URL deploy preview Netlify est **persistante** tant que la PR est ouverte : pratique pour des allers-retours sans avoir à redéployer manuellement.

---

## Comment NE PAS casser le back de Bernard

### Règle d'or : si tu touches un fichier hors de ta zone, ouvre une PR séparée

Tout est dans le tableau "Zone Bernard" plus haut. Si tu as besoin de :
- Changer la nav (ajouter/retirer un lien) → ping Bernard, on fait ça ensemble
- Renommer une route (`/reservation` → `/booking`) → ping Bernard
- Ajouter une dépendance (Framer Motion, GSAP…) → ping Bernard
- Modifier `app/layout.tsx` (au-delà du footer) → ping Bernard

### Vérifications à faire avant de pusher

```bash
npm run build         # build prod doit passer
npm run dev           # vérifie sur localhost que les pages back marchent toujours
```

Si tu modifies `globals.css` (couleurs, fonts), navigue sur ces pages pour t'assurer que tout reste lisible :
- `/reservation` (grille planning)
- `/mon-compte` (dashboard membre)
- `/admin` (dashboard admin) — login `admin@badsclub.com` / `admin`

### GitHub CODEOWNERS

Le fichier [`.github/CODEOWNERS`](./.github/CODEOWNERS) assigne automatiquement Bernard en reviewer dès que tu touches à un fichier critique. Tu n'as rien à faire, c'est GitHub qui s'en occupe.

---

## Premier objectif Adelin (suggestion)

Sprint 1 — 3 à 5 jours :
1. **Récupérer les photos du Bad's Club** auprès du client (intérieur, terrains, lounge, ambiance)
2. **Refondre la homepage** `app/page.tsx` avec :
   - Vraies photos
   - Direction artistique finale (la maquette actuelle est volontairement neutre, à toi de la marquer Bad's)
   - Sections : hero, sports, lounge, communauté, témoignages, événements à venir
3. **Footer + identité graphique** : couleurs, typo, logo si besoin de réajuster
4. **Pages légales** : peaufiner copy & layout

Une fois ces 4 points livrés, on a un site vitrine prêt à présenter au client.

---

## Communication

- Channel principal : on convient ensemble (Slack, WhatsApp, etc.)
- PR review : Bernard répond sous 24h ouvrées
- Bug bloquant : ping direct
- Hebdo de sync : mardi 14h (à ajuster)

---

## Compte à jour de la stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind v4 beta**
- **TypeScript 5**
- **Playwright** (capture maquette)

Tout est dans `package.json`. `npm install` suffit, pas de configuration cachée.

---

Questions ? Bernard est dispo.
