/**
 * Modèle de données — gestion des terrains et des réservations.
 *
 * Mapping Firestore prévu (cf docs/firestore.md) :
 *
 *   /sports/{sportId}                                    → Sport (statique, géré en config)
 *   /courts/{courtId}                                    → Court
 *   /bookings/{bookingId}                                → Booking (confirmé, payé)
 *   /bookings/{bookingId}/participants/{uid}             → BookingParticipant
 *   /holds/{holdId}                                      → Hold (TTL Firestore, expire seul)
 *   /groups/{groupId}                                    → GroupBooking (résa récurrentes pour un groupe)
 *
 * Toutes les dates manipulées en interne sont des `Date` JS (UTC).
 * Les clés de slot (`SlotKey`) sont en heure locale Paris pour des raisons d'affichage.
 */

export type SportId = "badminton" | "squash" | "petanque" | "tennis_table" | "baseball";

export type Court = {
  id: string;           // "BAD-01", "SQS-02", "PET-03"
  sportId: SportId;
  label: string;        // "Terrain 1"
  number: number;
  isActive: boolean;
  hourlyRate: number;   // tarif public (€/h) — le tarif membre s'applique au moment du devis
  notes?: string;       // ex. "côté fenêtre", "moquette refaite 2025"
};

/** Identifiant déterministe d'un créneau, ex. "BAD-02@2026-05-22T19:00". */
export type SlotKey = string;

export type SlotStatus =
  | "free"      // libre, réservable
  | "held"      // hold actif (un user est en train de payer)
  | "booked"    // réservé, confirmé
  | "blocked"   // bloqué admin (maintenance, tournoi…)
  | "past"      // déjà passé
  | "closed";   // hors horaires d'ouverture

export type Slot = {
  key: SlotKey;
  courtId: string;
  sportId: SportId;
  startsAt: Date;
  endsAt: Date;
  status: SlotStatus;
  /** Zone tarifaire pour bad/squash, null pour pétanque ou hors plage. */
  zone: "red" | "blue" | "green" | null;
  /** Prix indicatif en cents, calculé via quotePrice. */
  priceCents: number;
  /** Si held/booked, l'identité du holder/booker (anonymisé pour les autres users). */
  ownedBy?: string;
};

export type Booking = {
  id: string;
  courtId: string;
  sportId: SportId;
  ownerId: string;          // uid Firebase
  startsAt: Date;
  endsAt: Date;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  priceCents: number;       // ce qui a été facturé (en cents)
  isMemberRate: boolean;
  paymentIntentId?: string; // Stripe
  groupId?: string;         // si réservation de groupe
  participants: number;     // 1-6 selon sport
  participantIds?: string[];
  createdAt: Date;
  cancelledAt?: Date;
  cancellationRefundCents?: number;
};

export type Hold = {
  id: string;
  slotKey: SlotKey;
  courtId: string;
  startsAt: Date;
  endsAt: Date;
  userId: string;
  expiresAt: Date;          // TTL géré côté Firestore
  intent: "checkout" | "group_pending";
  createdAt: Date;
};

export type BookingError =
  | { code: "slot_taken"; message: string }
  | { code: "outside_open_hours"; message: string }
  | { code: "outside_advance_window"; message: string }
  | { code: "in_the_past"; message: string }
  | { code: "max_active_reached"; message: string; max: number }
  | { code: "blocked_admin"; message: string }
  | { code: "hold_expired"; message: string }
  | { code: "hold_not_yours"; message: string }
  | { code: "not_found"; message: string }
  | { code: "cancellation_too_late"; message: string };

export type Money = { cents: number; currency: "EUR" };
export type PriceQuote = {
  base: Money;
  total: Money;
  /** Zone tarifaire appliquée (bad/squash) ou null pour pétanque. */
  zone: "red" | "blue" | "green" | null;
  zoneLabel: string | null;
  /** Étiquettes pour expliquer le prix dans l'UI. */
  notes: string[];
};
