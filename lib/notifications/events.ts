/**
 * Catalogue des événements de notification.
 *
 * Un événement est une description IMMUABLE de quelque chose qui vient de se passer
 * dans l'app (résa confirmée, créneau libéré, etc.). Il ne décrit PAS la manière de
 * notifier (email vs SMS vs push) — c'est N8N qui décide en fonction du type
 * et de la disponibilité des contacts du destinataire.
 *
 * Tous les events partagent une enveloppe commune (`NotificationEnvelope`) qui
 * facilite le routing N8N et le logging.
 */

import type { Zone } from "@/lib/booking/config";
import type { SportId } from "@/lib/booking/types";

export type NotificationEventType =
  | "booking.confirmed"
  | "booking.cancelled"
  | "booking.reminder_30min"
  | "waitlist.slot_available"
  | "admin.booking_created"
  | "admin.booking_cancelled";

/** Enveloppe stable envoyée à N8N pour TOUS les events. */
export type NotificationEnvelope<T extends NotificationEventType = NotificationEventType> = {
  /** Identifiant unique de l'event — utilisé comme clé d'idempotence côté N8N. */
  id: string;
  type: T;
  /** ISO 8601 UTC. */
  occurredAt: string;
  /** "member" ou "admin" — N8N choisit la liste de destinataires. */
  audience: "member" | "admin";
  /** uid Firebase du destinataire principal (vide pour broadcast admin). */
  recipientId: string | null;
  /** Métadonnées spécifiques au type d'event. */
  data: NotificationData[T];
  /** Liens d'action profonds (deep links) à coller dans email/SMS. */
  links: { primary?: string; secondary?: string };
};

// -----------------------------------------------------------------------------
// Payloads par type
// -----------------------------------------------------------------------------

export type BookingSnapshot = {
  bookingId: string;
  courtId: string;
  courtLabel: string;
  sportId: SportId;
  sportLabel: string;
  zone: Zone | null;
  zoneLabel: string | null;
  startsAt: string;       // ISO
  endsAt: string;
  priceCents: number;
};

export type RecipientSnapshot = {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
};

export type NotificationData = {
  "booking.confirmed": {
    booking: BookingSnapshot;
    recipient: RecipientSnapshot;
    paymentIntentId?: string;
  };
  "booking.cancelled": {
    booking: BookingSnapshot;
    recipient: RecipientSnapshot;
    refundCents: number;
    cancelledBy: "member" | "admin";
    reason?: string;
  };
  "booking.reminder_30min": {
    booking: BookingSnapshot;
    recipient: RecipientSnapshot;
    minutesUntilStart: number;
  };
  "waitlist.slot_available": {
    /** Le slot qui vient d'être libéré. */
    slot: Omit<BookingSnapshot, "bookingId" | "priceCents"> & { priceCents: number };
    recipient: RecipientSnapshot;
    /** Délai accordé au membre pour confirmer avant que la place passe au suivant. */
    expiresAt: string;
    position: number; // 1 = premier en file
  };
  "admin.booking_created": {
    booking: BookingSnapshot;
    bookedBy: RecipientSnapshot;
  };
  "admin.booking_cancelled": {
    booking: BookingSnapshot;
    cancelledBy: RecipientSnapshot;
    refundCents: number;
    reason?: string;
  };
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

export function nowIso(): string {
  return new Date().toISOString();
}

export function envelopeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `evt_${crypto.randomUUID().slice(0, 18)}`;
  }
  return `evt_${Math.random().toString(36).slice(2, 14)}_${Date.now()}`;
}
