# Bad's Club — Application

Refonte digitale du Bad's Club par **ProjectView** : site vitrine + réservation + communauté + paiement + notifications + automatisation contenu.

🌍 **Démo en ligne** : [bads-club.netlify.app](https://bads-club.netlify.app)

---

## Pour Adelin (front & design)

👉 **Lis [`HANDOFF.md`](./HANDOFF.md)** en premier — périmètre, workflow, premières missions.

```bash
git clone <URL_DU_REPO> bads-club
cd bads-club
npm install
npm run dev    # http://localhost:3000
```

Login démo : `lea@example.com` / `demo` (membre) ou `admin@badsclub.com` / `admin` (admin).

---

## Pour Bernard (back & infra)

Stack cible : **Next.js + Firebase + Brevo + Netlify + Crédit Mutuel + N8N**.

Docs :
- [docs/firestore.md](./docs/firestore.md) — modèle de données + security rules + Cloud Functions
- [docs/notifications.md](./docs/notifications.md) — orchestration N8N + Brevo + FCM

État actuel : **maquette cliquable**. Tout est mocké côté données ([lib/booking/repository.ts](./lib/booking/repository.ts), [lib/auth.ts](./lib/auth.ts)). Le swap vers Firebase se fait sans toucher aux composants UI — seules les couches `repository.ts` et `auth.ts` sont à réécrire.

---

## Commandes utiles

```bash
npm run dev              # serveur de dev localhost:3000
npm run build            # build prod (lint + types + bundle)
npx tsx lib/booking/rules.test.ts   # smoke tests règles métier (21 tests)
```

---

## Structure

```
app/
├── (legal)/         CGU, mentions, RGPD
├── admin/           Espace admin (dashboard, résa, membres, articles, notifs)
├── api/             Routes serveur
├── communaute/      Groupes thématiques + chat
├── evenements/      Tournois, Olympiade, etc.
├── mon-compte/      Espace membre
├── reservation/     Réservation temps réel multi-créneaux
├── ...              Pages publiques (home, tarifs, actualités, connexion…)
lib/
├── booking/         Moteur réservation (config, rules, repository, service, waitlist)
├── notifications/   Dispatcher events + payload N8N
└── auth.ts          Auth mock → swap firebase/auth en prod
components/          UI partagée (nav, modal, toast, install-prompt…)
public/              Manifest PWA, icons, service worker
docs/                Docs techniques
```

---

## Stack

- **Next.js 15** App Router
- **React 19**
- **Tailwind v4 beta**
- **TypeScript 5**

Déployé sur Netlify.

---

## Démarche commerciale

L'offre commerciale au client = la maquette en ligne + setup 3 000 € + abonnement 500 €/mois (cf. [offer/](./offer/) pour le PDF généré).

Procédure de passation Bernard ↔ Adelin : [HANDOFF.md](./HANDOFF.md).
