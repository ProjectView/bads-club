/**
 * Liste d'attente sur les créneaux.
 *
 * Modèle Firestore :
 *
 *   /waitlist/{slotKey}/entries/{uid}
 *     - userId, joinedAt, status: "pending" | "notified" | "accepted" | "expired"
 *     - notifiedAt?, expiresAt?  (créé à la libération du slot)
 *
 *   Sous-collection sous /waitlist/{slotKey} : auto-indexé par order(joinedAt asc),
 *   permet de désigner le "premier en file" d'un simple `limit(1)`.
 *
 * Politique de libération :
 *   Quand un booking est annulé, on désigne le premier entry en `pending`,
 *   on passe son statut à `notified` avec un `expiresAt = now + 10 min`.
 *   N8N envoie l'email/SMS "ton créneau est libre, confirme avant {expiresAt}".
 *   À l'expiration, un cron passe son statut à `expired` et désigne le suivant.
 */

import type { SlotKey } from "./types";

export type WaitlistStatus = "pending" | "notified" | "accepted" | "expired";

export type WaitlistEntry = {
  slotKey: SlotKey;
  courtId: string;
  startsAt: Date;
  endsAt: Date;
  userId: string;
  joinedAt: Date;
  status: WaitlistStatus;
  notifiedAt?: Date;
  expiresAt?: Date;
};

/** Délai pendant lequel le premier en liste a la priorité après libération. */
export const WAITLIST_GRACE_MIN = 10;
