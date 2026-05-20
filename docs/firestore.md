# Modèle Firestore — Gestion des terrains et réservations

Ce document décrit comment le moteur de réservation (`lib/booking/`) se branche sur Firestore quand le projet sera créé. La logique métier (`rules.ts`, `service.ts`) reste **identique** ; seule l'implémentation du `BookingRepository` change.

## 1. Collections

```
/users/{uid}
  - displayName, email, phone, role: "member" | "admin"
  - favoriteSport, newsletter, createdAt
  - stripeCustomerId, membershipExpiresAt
  - activeBookingsCount  ← compteur dénormalisé (incrémenté en transaction)

/courts/{courtId}                              ← ex. "BAD-01"
  - sportId: "badminton" | "squash" | "petanque"
  - label, number, isActive, hourlyRate
  - notes (optionnel)

/bookings/{bookingId}                          ← ex. "bkg_AbCdEf"
  - courtId, sportId, ownerId
  - startsAt: Timestamp (UTC)
  - endsAt: Timestamp
  - status: "confirmed" | "cancelled" | "completed" | "no_show"
  - priceCents, isMemberRate, paymentIntentId
  - groupId? (si réservation d'un groupe)
  - participantIds?: string[]
  - slotKey: string                            ← "BAD-01@2026-05-22T19:00" (heure locale Paris)
  - createdAt, cancelledAt?, cancellationRefundCents?

/holds/{slotKey}                               ← docId = slotKey ⇒ unicité native
  - userId, courtId, startsAt, endsAt, expiresAt
  - intent: "checkout" | "group_pending"
  - createdAt

/groups/{groupId}
  - name, sportId, ownerId, isPublic
  - memberIds: string[]
  - recurrence: { freq: "weekly" | "monthly", dayOfWeek?, dayOfMonth?, time: "HH:mm", durationMin }
  - createdAt

/groups/{groupId}/messages/{messageId}
  - userId, text, createdAt

/articles/{articleId}                          ← pour l'admin → automatisation réseaux
  - title, body, coverUrl, status: "draft" | "scheduled" | "published"
  - scheduledFor?, publishedAt?
  - channels: ("instagram" | "facebook" | "linkedin")[]
  - aiVariants: { instagram?, facebook?, linkedin? }
```

## 2. Garanties de concurrence

### 2.1. Unicité d'un slot

Le `docId` de `/holds/{slotKey}` **est** la clé du slot (`BAD-01@2026-05-22T19:00`). Firestore garantit l'unicité du docId : impossible d'avoir deux holds simultanés sur le même slot.

Pour `/bookings`, on stocke en plus un index sur `slotKey` (filtre composé : `status == "confirmed" AND slotKey == ?`) pour vérifier qu'il n'existe pas déjà une réservation confirmée.

### 2.2. Transaction de pose de hold

```ts
await runTransaction(db, async tx => {
  const holdRef = doc(db, "holds", slotKey);
  const bookingQuery = query(
    collection(db, "bookings"),
    where("slotKey", "==", slotKey),
    where("status", "==", "confirmed"),
    limit(1)
  );
  const [existingHold, existingBooking] = await Promise.all([
    tx.get(holdRef),
    getDocs(bookingQuery), // hors tx : OK car bookings confirmés sont immuables côté slotKey
  ]);
  if (!existingBooking.empty) throw { code: "slot_taken" };
  if (existingHold.exists()) {
    const data = existingHold.data();
    if (data.userId !== uid && data.expiresAt.toMillis() > Date.now()) {
      throw { code: "slot_taken" };
    }
  }
  tx.set(holdRef, {
    userId: uid, courtId, startsAt, endsAt,
    expiresAt: Timestamp.fromDate(new Date(Date.now() + HOLD_TTL_MIN * 60_000)),
    intent: "checkout", createdAt: serverTimestamp(),
  });
});
```

### 2.3. Confirmation hold → booking

```ts
await runTransaction(db, async tx => {
  const holdSnap = await tx.get(doc(db, "holds", slotKey));
  if (!holdSnap.exists()) throw { code: "hold_expired" };
  const hold = holdSnap.data();
  if (hold.userId !== uid) throw { code: "hold_not_yours" };
  if (hold.expiresAt.toMillis() <= Date.now()) throw { code: "hold_expired" };

  // Crée le booking avec un id explicite pour idempotence (rejouable si webhook Stripe rejoue).
  tx.set(doc(db, "bookings", bookingId), { ...bookingData, status: "confirmed", slotKey });
  tx.delete(holdSnap.ref);

  // Compteur dénormalisé
  tx.update(doc(db, "users", uid), { activeBookingsCount: increment(1) });
});
```

### 2.4. TTL des holds

Firestore supporte les TTL natifs depuis 2023. Configurer la policy :

```bash
gcloud firestore fields ttls update expiresAt --collection-group=holds
```

Les holds expirés sont automatiquement supprimés, libérant les slots côté lecture.

## 3. Index composés à créer

```yaml
# firestore.indexes.json
indexes:
  - collection: bookings
    fields: [{ field: ownerId, order: ASCENDING }, { field: startsAt, order: ASCENDING }]
  - collection: bookings
    fields: [{ field: sportId, order: ASCENDING }, { field: startsAt, order: ASCENDING }]
  - collection: bookings
    fields: [{ field: slotKey, order: ASCENDING }, { field: status, order: ASCENDING }]
  - collection: bookings
    fields: [{ field: status, order: ASCENDING }, { field: startsAt, order: ASCENDING }]
  - collectionGroup: messages
    fields: [{ field: createdAt, order: DESCENDING }]
```

## 4. Security rules (esquisse)

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {

    function isAuthed() { return request.auth != null; }
    function isAdmin()  { return isAuthed() && request.auth.token.role == "admin"; }
    function isSelf(uid){ return isAuthed() && request.auth.uid == uid; }

    match /users/{uid} {
      allow read:   if isSelf(uid) || isAdmin();
      allow create: if isSelf(uid);
      allow update: if isSelf(uid) || isAdmin();
    }

    match /courts/{courtId} {
      allow read: if true;                  // catalogue public
      allow write: if isAdmin();
    }

    match /bookings/{bookingId} {
      allow read:   if isAuthed() && (resource.data.ownerId == request.auth.uid || isAdmin());
      // Création/maj passe TOUJOURS par une Cloud Function (sécurise prix, paiement, conflits).
      allow create, update, delete: if false;
    }

    match /holds/{slotKey} {
      allow read: if isAuthed();
      allow create: if isAuthed() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthed() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthed() && (resource.data.userId == request.auth.uid || isAdmin());
    }

    match /groups/{groupId} {
      allow read: if isAuthed() && (resource.data.isPublic || request.auth.uid in resource.data.memberIds);
      allow create: if isAuthed();
      allow update: if isAuthed() && request.auth.uid == resource.data.ownerId;
      allow delete: if isAuthed() && request.auth.uid == resource.data.ownerId;

      match /messages/{messageId} {
        allow read: if isAuthed() && request.auth.uid in get(/databases/$(db)/documents/groups/$(groupId)).data.memberIds;
        allow create: if isAuthed() && request.resource.data.userId == request.auth.uid;
        allow update, delete: if isAuthed() && resource.data.userId == request.auth.uid;
      }
    }
  }
}
```

## 5. Cloud Functions à prévoir

| Fonction | Trigger | Rôle |
|---|---|---|
| `createPaymentIntent` | Callable HTTPS | Crée un PaymentIntent Stripe avec le montant exact issu de `quotePrice()` (jamais le client) |
| `confirmBookingFromWebhook` | Stripe webhook `payment_intent.succeeded` | Lit `holdId` dans la metadata, exécute la transaction `confirmHold` |
| `releaseHoldOnPaymentFailed` | Stripe webhook `payment_intent.payment_failed` | Supprime le hold pour libérer le slot |
| `createRecurringBookings` | Pub/Sub cron quotidien | Pour chaque `/groups/*` avec récurrence, pose les holds → bookings pour la semaine suivante |
| `markNoShows` | Pub/Sub cron horaire | Bookings dont `endsAt < now` et non check-in → `status = "no_show"` |
| `aiReformatArticle` | Firestore `onCreate /articles/*` | Génère les 3 variantes IG/FB/LinkedIn via Anthropic API |
| `publishToSocials` | Firestore `onUpdate /articles/*` (status → scheduled) + Cloud Scheduler | Publie sur les comptes connectés à l'heure programmée |

## 6. Migration depuis l'impl in-memory

Le seul fichier à réécrire est `lib/booking/repository.ts`. Les signatures de `BookingRepository` mappent 1-1 :

| Méthode | Implémentation Firestore |
|---|---|
| `listBookingsInRange` | `query(collection("bookings"), where("status","==","confirmed"), where("startsAt","<",to), where("endsAt",">",from))` |
| `listActiveHoldsInRange` | `query(collection("holds"), where("expiresAt",">",now), where("startsAt","<",to))` |
| `getBookingBySlot` | `query(collection("bookings"), where("slotKey","==",key), where("status","==","confirmed"), limit(1))` |
| `getActiveHold` | `getDoc(doc("holds", slotKey))` |
| `putHold` | transaction décrite en §2.2 |
| `confirmHold` | transaction décrite en §2.3 |
| `cancelBooking` | `updateDoc` + `increment(-1)` sur le compteur user |

Tout le reste (validation, pricing, énumération des slots) reste **identique** : `rules.ts` ne dépend pas de la persistance.
