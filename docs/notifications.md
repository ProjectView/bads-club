# Notifications — Architecture & flow N8N

## Principe

L'application Next.js **n'envoie jamais** d'email ou de SMS directement. Elle se contente d'émettre des **événements typés** vers un **unique webhook N8N**, qui orchestre ensuite la livraison.

```
App Next.js  ──POST JSON──►  N8N webhook  ──►  email · SMS · Slack · Push
```

**Pourquoi** :
- Un seul endroit où on choisit le provider (Mailjet → SendGrid → ...) sans toucher au code
- Logs, retry et idempotence centralisés
- Templates email/SMS modifiables sans déploiement de l'app
- A/B des canaux possible (ex. tester SMS vs email pour le rappel 30 min)

## Variable d'env

Sur Vercel (Settings → Environment Variables), ajouter :

```
N8N_NOTIF_WEBHOOK = https://n8n.projectview.fr/webhook/bads-notif
```

Quand cette variable est définie, [`lib/notifications/dispatcher.ts`](../lib/notifications/dispatcher.ts) POST chaque event vers ce webhook. Sans la variable, les events sont juste stockés en mémoire (utile pour la maquette et les tests).

## Les 6 événements

| Type | Quand | Destinataire | Canaux suggérés | Priorité |
|---|---|---|---|---|
| `booking.confirmed` | Résa confirmée et payée | Membre | Email | Standard |
| `booking.cancelled` | Annulation par membre ou admin | Membre | Email | Standard |
| `booking.reminder_30min` | T-30min avant le créneau | Membre | SMS (si tél), sinon push/email | Haute |
| `waitlist.slot_available` | Un créneau bookmé est annulé, premier en file notifié | Membre | Email + SMS (urgent) | Critique |
| `admin.booking_created` | Nouvelle résa quelconque | Tous admins | Email + Slack | Standard |
| `admin.booking_cancelled` | Annulation quelconque | Tous admins | Email + Slack | Standard |

## Schéma du payload

Tous les events partagent la même enveloppe — N8N route ensuite sur `type` et `audience`.

```jsonc
{
  "id": "evt_a1b2c3d4e5f6",                  // idempotence : N8N doit dédupliquer
  "type": "booking.confirmed",
  "occurredAt": "2026-05-22T17:00:00.000Z",
  "audience": "member",                       // "member" ou "admin"
  "recipientId": "user-001",                  // uid Firebase, null pour broadcast admin
  "data": { /* dépend du type, cf. ci-dessous */ },
  "links": {
    "primary": "/mon-compte#reservations",   // deep link à mettre dans email/SMS
    "secondary": null
  }
}
```

### `booking.confirmed`

```jsonc
{
  "booking": {
    "bookingId": "bkg_xyz",
    "courtId": "BAD-02",
    "courtLabel": "Terrain 2",
    "sportId": "badminton",
    "sportLabel": "Badminton",
    "zone": "red",
    "zoneLabel": "Rouge",
    "startsAt": "2026-05-22T17:00:00.000Z",
    "endsAt": "2026-05-22T18:00:00.000Z",
    "priceCents": 2200
  },
  "recipient": {
    "uid": "user-001",
    "displayName": "Léa Martin",
    "email": "lea@example.com",
    "phone": "06 12 34 56 78"
  },
  "paymentIntentId": "pi_xxx"
}
```

### `booking.cancelled`

Ajoute `refundCents`, `cancelledBy: "member" | "admin"`, `reason?`.

### `booking.reminder_30min`

Ajoute `minutesUntilStart`. Émis par un **cron Firebase** (cf. §Cron).

### `waitlist.slot_available`

```jsonc
{
  "slot": { /* même forme que booking mais sans bookingId */ },
  "recipient": { ... },
  "expiresAt": "2026-05-22T16:10:00.000Z",  // délai d'exclusivité (10 min)
  "position": 1
}
```

⚠️ Très important : N8N doit envoyer **immédiatement** (SMS prio), car le membre n'a que 10 min pour confirmer avant que la place ne passe au suivant.

### `admin.booking_created` / `admin.booking_cancelled`

Mêmes infos que les events membre, plus `bookedBy` / `cancelledBy` (qui a fait l'action).

## Canaux & coûts

| Canal | Provider | Coût récurrent | Latence | Notes |
|---|---|---|---|---|
| **Web Push (PWA)** | Firebase Cloud Messaging | **0€** | Instant | Géré côté Cloud Function (Firebase Admin SDK), pas via N8N |
| **Email** | **Brevo** | **0€** jusqu'à 9000/mois | ~10s | Templates dans Brevo, déclencheur API via N8N |
| **SMS** | **Brevo** (même API que l'email) | ~0,045€/SMS · pack min. 100 | Instant | Réservé au rappel 30 min critique sans push dispo |

**Stack finale = 3 services** : Firebase (auth + data + FCM) · Brevo (email + SMS unifiés) · Vercel (hosting).

Telegram, WhatsApp et consorts ont été écartés : la PWA + email + SMS Brevo couvrent 99% des besoins pour un coût marginal. WhatsApp Business reste activable plus tard via le même nœud Brevo si le client veut booster l'adoption.

**Préférences utilisateur** stockées sur `/users/{uid}` :

```ts
{
  notif: {
    push: true,                        // FCM token enregistré ?
    email: true,
    // SMS toujours actif en fallback si numéro renseigné (rappel 30 min critique)
  },
  fcmTokens: ["token1", "token2"]      // 1 device = 1 token
}
```

**Logique de routing** (à implémenter côté N8N "Switch" sur le canal) :

| Event | Canaux par ordre de priorité |
|---|---|
| `booking.confirmed`, `booking.cancelled` | Email (toujours) + Push (si activé) |
| `booking.reminder_30min` | Push → SMS → Email (premier dispo) |
| `waitlist.slot_available` | Push + SMS en parallèle (urgent) + Email log |
| `admin.*` | Email + Slack en parallèle (broadcast à tous les admins) |

## Setup providers

### Firebase Cloud Messaging (Web Push)

1. Console Firebase → Cloud Messaging → Web configuration → générer une VAPID key
2. Ajouter dans Vercel : `NEXT_PUBLIC_FIREBASE_VAPID_KEY`
3. Le client (composant `notif-preferences.tsx`) appelle `getToken()` de `firebase/messaging` et POST le token sur `/api/notif/register-fcm`
4. Le token est stocké dans `/users/{uid}/fcmTokens/{token}`
5. Quand un event `booking.*` est émis, une Cloud Function lit tous les tokens du destinataire et appelle `messaging.send()` pour chaque
6. Le service worker [`/public/sw.js`](../public/sw.js) capte le `push` event et affiche la notif native

### Brevo (Email + SMS unifiés)

1. Créer un compte Brevo gratuit, générer une **clé API v3**
2. Ajouter dans Vercel : `BREVO_API_KEY`
3. **Email** : créer les templates dans Brevo
   - `tmpl_booking_confirmed`, `tmpl_booking_cancelled`, `tmpl_reminder`, `tmpl_waitlist`, `tmpl_admin_notify`
   - Variables : `{{ booking.sportLabel }}`, `{{ booking.courtLabel }}`, `{{ booking.startsAt }}`, etc.
   - Dans N8N : nœud "Brevo" → "Send Transactional Email" avec `templateId`
4. **SMS** : enregistrer un Sender ID "BADS CLUB" (requis depuis 13 mars 2026 pour nouveaux comptes Brevo)
   - Acheter un pack initial de 100 crédits (~4,50€) pour la phase pilote
   - Dans N8N : nœud "Brevo" → "Send Transactional SMS" avec `sender = "BADS CLUB"` et `content` (max 160 chars en GSM7, sinon 70 chars)
5. **Choix du canal côté N8N** : Switch sur le type d'event et les préfs user (cf. tableau de routing ci-dessus)

## Workflow N8N suggéré

```
[Webhook trigger: /webhook/bads-notif]
   │
   ▼
[IF event.type starts with "admin."]
   ├── true ──► [Get admins from Firestore users where role=="admin"]
   │              │
   │              ▼
   │           [Loop over admins]
   │              ├── [Mailjet: send admin email template]
   │              └── [Slack: post in #bads-bookings]
   │
   └── false ──► [Switch on event.type]
                   │
                   ├── "booking.confirmed" ──► [Mailjet: tmpl_booking_confirmed]
                   │
                   ├── "booking.cancelled" ──► [Mailjet: tmpl_booking_cancelled]
                   │
                   ├── "booking.reminder_30min"
                   │      │
                   │      ▼
                   │   [IF push activé] ──► [FCM Cloud Function]
                   │   [ELSE IF phone] ──► [Brevo SMS]
                   │   [ELSE] ──────────► [Brevo email tmpl_reminder]
                   │
                   └── "waitlist.slot_available"
                          │
                          ▼
                       [Parallel: FCM push + Brevo SMS + Brevo email tmpl_waitlist]
```

**Idempotence** : ajouter un nœud "Function" en début qui dédupplique via `event.id` (cache Redis ou table Postgres). Sinon les retries de N8N peuvent doubler les envois.

**Retry policy** : N8N retry exponentiel 3 fois sur 4xx/5xx du provider, puis log en erreur (Sentry).

## Cron 30 min · à implémenter côté Firebase

Le rappel n'est PAS émis par l'app — il vient d'une Cloud Function planifiée :

```ts
// functions/src/reminder30min.ts
import { onSchedule } from "firebase-functions/v2/scheduler";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

export const reminder30min = onSchedule({ schedule: "every 5 minutes", region: "europe-west1" }, async () => {
  const db = getFirestore();
  const now = Date.now();
  const windowStart = new Date(now + 25 * 60_000);  // [25 min, 35 min] à venir
  const windowEnd = new Date(now + 35 * 60_000);

  const snap = await db.collection("bookings")
    .where("status", "==", "confirmed")
    .where("reminderSentAt", "==", null)
    .where("startsAt", ">=", Timestamp.fromDate(windowStart))
    .where("startsAt", "<=", Timestamp.fromDate(windowEnd))
    .get();

  for (const doc of snap.docs) {
    const b = doc.data();
    // POST event vers le même webhook N8N que l'app
    await fetch(process.env.N8N_NOTIF_WEBHOOK!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: `evt_reminder_${doc.id}`,                  // idempotent par bookingId
        type: "booking.reminder_30min",
        occurredAt: new Date().toISOString(),
        audience: "member",
        recipientId: b.ownerId,
        data: {
          booking: { /* snapshot */ },
          recipient: { /* lu depuis /users/{uid} */ },
          minutesUntilStart: Math.round((b.startsAt.toDate().getTime() - now) / 60_000),
        },
        links: { primary: "/mon-compte#reservations" }
      })
    });
    await doc.ref.update({ reminderSentAt: Timestamp.now() });
  }
});
```

Le champ `reminderSentAt` sur le booking évite les doublons (même si le cron tourne plusieurs fois sur la même fenêtre).

## Waitlist · libération automatique

Quand un booking est annulé, le service appelle déjà `releaseSlotToWaitlist()` qui :
1. trouve le premier `pending` de la file
2. passe son statut à `notified` + pose un `expiresAt = now + 10 min`
3. émet `waitlist.slot_available` vers N8N

À ajouter en prod : un **second cron** qui scrute les entries `notified` dont `expiresAt < now` :
- passe le statut à `expired`
- promeut le suivant en `notified` + nouvelle notif

```ts
export const waitlistExpiry = onSchedule({ schedule: "every 2 minutes" }, async () => {
  // ... même logique
});
```

## Logs & monitoring

- N8N stocke les exécutions → dashboard "résa du jour" pour les admins
- Sentry sur les Cloud Functions (rappel + waitlist expiry)
- Vue admin temps réel : [/admin/notifications](/admin/notifications) (déjà implémentée)

## Sécurité

- Le webhook N8N doit exiger un header `X-Bads-Source: app` + signature HMAC sur `body` avec un secret partagé (à ajouter dans le dispatcher : `crypto.createHmac("sha256", secret).update(payload).digest("hex")`)
- Côté N8N : valider la signature avant traitement
- Côté app : ne jamais inclure de données sensibles (carte bancaire, mot de passe) dans le payload
