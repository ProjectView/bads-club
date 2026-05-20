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

- **`main`** : production · déployée sur **bads-club.vercel.app** · pas de push direct
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
# → Vercel génère automatiquement une URL preview
# → Bernard review la PR
# → Merge dans dev quand validé
```

### Procédure pour merger en production

Bernard merge `dev` → `main` une fois par semaine ou à la demande, après validation des features.

---

## Vercel & déploiements

Une fois le repo connecté à Vercel (cf. setup en bas) :

| Action | Résultat |
|---|---|
| Push sur `main` | Deploy **production** → bads-club.vercel.app |
| Push sur `dev` | Deploy preview stable → `bads-club-dev-project-view.vercel.app` |
| Open PR | Deploy preview unique → URL postée en commentaire du PR |

Adelin n'a **pas besoin** d'avoir un accès Vercel direct — il bosse sur Git, Vercel fait le reste.

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
| **Vercel** | Bernard (optionnel) | Lecture du dashboard `project-view` pour voir les déploiements |
| **Figma / drive design** | Adelin lui-même | À mettre en place si besoin |
| **Photos / brand assets Bad's Club** | Le client | Recevoir photos club, charte si elle existe |

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
